document.getElementById("upload-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file!");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            displayResults(data);
            document.getElementById("results").style.display = "block";

            // Update button and file input states
            updateButtonState('reviewed');
            updateFileState('uploaded');
        } else {
            alert("Error analyzing file. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});

document.getElementById('file').addEventListener('change', function() {
    if (this.files.length > 0) {
        updateButtonState('ready');
        updateFileState('selected');
        showChooseNewFile(); // Show "Choose New File" text when a file is selected
    } else {
        resetButtonState();
        resetFileState();
    }
});

// Add event listener for "Choose New File" button
document.getElementById('choose-new-file').addEventListener('click', function () {
    const fileInput = document.getElementById('file');
    fileInput.disabled = false; // Enable file input
    fileInput.click(); // Trigger file dialog
});

// Add event listener for file input change
document.getElementById('file').addEventListener('change', function () {
    const submitButton = document.getElementById('submit-button');
    if (this.files.length > 0) {
        // Reset the state of submit-button
        submitButton.style.backgroundColor = ''; // Reset background color to default
        submitButton.innerHTML = 'Review Document'; // Reset text
        submitButton.disabled = false; // Enable the button
        submitButton.classList.remove('reviewed'); // Remove any additional classes
    }
});

// Clear buttonState on page unload
window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('buttonState');
    sessionStorage.removeItem('fileState');
});

// Load button state and results from session storage on page load
window.addEventListener('load', function() {
    const buttonState = sessionStorage.getItem('buttonState');
    const fileState = sessionStorage.getItem('fileState');
    const storedResults = sessionStorage.getItem('analysisResults');
    const navigatedBack = sessionStorage.getItem('navigatedBack');

    if (navigatedBack === 'true') {
        if (buttonState) {
            updateButtonState(buttonState);
        }
        if (fileState) {
            updateFileState(fileState);
            showChooseNewFile();
        }
        if (storedResults) {
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = storedResults;
            resultsDiv.style.display = "block";
        }
        sessionStorage.removeItem('navigatedBack');
    }
});

function updateButtonState(state) {
    const submitButton = document.getElementById("submit-button");
    if (state === 'reviewed') {
        submitButton.classList.add('reviewed');
        submitButton.disabled = true;
        submitButton.style.cursor = 'default';
        submitButton.style.backgroundColor = 'green';
        submitButton.innerHTML = '<i class="fas fa-check" style="margin-right: 5px"></i> Review Complete';
        sessionStorage.setItem('buttonState', 'reviewed');
    } else if (state === 'ready') {
        submitButton.style.display = 'inline-block';
        setTimeout(() => {
            submitButton.style.opacity = 1;
        }, 10);
        sessionStorage.setItem('buttonState', 'ready'); // Add this line
    }
}

function resetButtonState() {
    const submitButton = document.getElementById("submit-button");
    submitButton.style.opacity = 0;
    setTimeout(() => {
        submitButton.style.display = 'none';
    }, 300);
    sessionStorage.removeItem('buttonState');
}

function updateFileState(state) {
    const fileInput = document.getElementById("file");
    const chooseFile = document.getElementById("choose-file");
    const chooseNewFile = document.getElementById("choose-new-file");

    if (state === 'uploaded') {
        fileInput.disabled = true;
        chooseFile.style.backgroundColor = 'green';
        chooseFile.style.cursor = 'default';
        chooseFile.classList.add('uploaded');
        chooseFile.innerHTML = '<i class="fas fa-check" style="margin-right: 5px"></i> File uploaded';
        chooseNewFile.classList.add('visible');
        sessionStorage.setItem('fileState', 'uploaded');
    } else if (state === 'selected') {
        chooseFile.style.backgroundColor = 'green';
        chooseFile.innerHTML = '<i class="fas fa-check" style="margin-right: 5px"></i> File uploaded';
        chooseNewFile.classList.add('visible');
        fileInput.disabled = true;
        chooseFile.style.cursor = 'default';
        sessionStorage.setItem('fileState', 'selected'); // Add this line
    }
}

function resetFileState() {
    const chooseFile = document.getElementById("choose-file");
    const chooseNewFile = document.getElementById("choose-new-file");

    chooseFile.style.backgroundColor = '';
    chooseFile.innerHTML = 'Choose File';
    chooseNewFile.classList.remove('visible');
    sessionStorage.removeItem('fileState');
}

function showChooseNewFile() {
    const chooseNewFile = document.getElementById("choose-new-file");
    const fileInput = document.getElementById("file");

    fileInput.disabled = false; // Ensure the file input is not disabled
    chooseNewFile.style.display = 'inline-block';
}

function displayResults(data) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<h2>Analysis Results</h2>";

    if (data.issues.length > 0) {
        let issuesHtml = "<h3>Issues:</h3><ul class='no-bullets'>";
        data.issues.forEach((issue) => {
            issuesHtml += `<li><strong>${issue.term}:</strong> ${issue.feedback}</li>`;
        });
        issuesHtml += "</ul>";
        resultsDiv.innerHTML += issuesHtml;
    } else {
        resultsDiv.innerHTML += "<p>No issues found. Great job!</p>";
    }

    if (data.suggestions.length > 0) {
        let suggestionsHtml = "<h3>Suggestions:</h3><ul>";
        data.suggestions.forEach((suggestion) => {
            suggestionsHtml += `<li>${suggestion}</li>`;
        });
        suggestionsHtml += "</ul>";
        resultsDiv.innerHTML += suggestionsHtml;
    }

    // Add the centered link
    resultsDiv.innerHTML += "<div class='center-text'><a href='/results'>View terms in source text</a></div>";

    // Store results in session storage
    sessionStorage.setItem('analysisResults', resultsDiv.innerHTML);

    // Debugging: Log the resultsDiv innerHTML to check the structure
    console.log(resultsDiv.innerHTML);
}

