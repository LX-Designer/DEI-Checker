document.getElementById("upload-form").addEventListener("submit", async function (event) {      // listen for form submission
    event.preventDefault();                                                                     // prevent default form submission behavior

    const fileInput = document.getElementById("file");                  // gets the input element and stores in 'fileInput'
    const file = fileInput.files[0];                                    // gets the actual file from the input element and stores it in 'file'

    if (!file) {                            // if a file isn't detected in the 'file' variable
        alert("Please select a file!");     // a;ert the user
        return;                             // stop running the function
    }

    const formData = new FormData();        // create new formData object
    formData.append("file", file);          // add the file (contained in 'file') to the formData object

    try {
        const response = await fetch("/upload", {       // make a POST request to the "/upload" endpoint. when the result of the request is returned, store it in the 'response' variable
            method: "POST",                             // specify the HTTP method as POST
            body: formData,                             // include the form data (file) in the request
        });

        if (response.ok) {                          
            const data = await response.json();     // parses the response as JSON. the response is the result of analyze_text() from helpers.py. the response is stored in 'data'
            displayResults(data);                   // displays results as per the function below
        } else {
            alert("Error analyzing file. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById("results");
    const docDiv = document.getElementById("doc")
    resultsDiv.innerHTML = "<h2>Analysis Results</h2>";

    
    docDiv.innerHTML += `
        <h3>Document Text with Highlights:</h3>
        <div style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd;">
            ${data.highlighted_text}                                                            // displays the highlighted text that is a result of analyze_text()
        </div>
    `;

    if (data.issues.length > 0) {
        resultsDiv.innerHTML += "<h3>Issues:</h3><ul>";
        data.issues.forEach((issue) => {
            resultsDiv.innerHTML += `<li><strong>${issue.term}:</strong> ${issue.feedback}</li>`;
        });
        resultsDiv.innerHTML += "</ul>";
    } else {
        resultsDiv.innerHTML += "<p>No issues found. Great job!</p>";
    }

    if (data.suggestions.length > 0) {
        resultsDiv.innerHTML += "<h3>Suggestions:</h3><ul>";
        data.suggestions.forEach((suggestion) => {
            resultsDiv.innerHTML += `<li>${suggestion}</li>`;
        });
        resultsDiv.innerHTML += "</ul>";
    }
}

document.getElementById('file').addEventListener('change', function() {
    const submitButton = document.getElementById('submit-button');
    const chooseFile = document.getElementById('choose-file');
    if (this.files.length > 0) {
        submitButton.style.display = 'inline-block';
        setTimeout(() => {
            submitButton.style.opacity = 1;
        }, 10); // Small delay to trigger the transition

        chooseFile.style.backgroundColor = 'green';
        chooseFile.innerHTML = '<i class="fas fa-check" style="margin-right: 5px"></i> File uploaded';
    } else {
        submitButton.style.opacity = 0;
        setTimeout(() => {
            submitButton.style.display = 'none';
        }, 300); // Match the duration of the transition

        chooseFile.style.backgroundColor = ''; // Reset background color
        chooseFile.innerHTML = 'Choose File'; // Reset label text
    }
});

document.getElementById('upload-form').addEventListener('submit', function(event) {
    const submitButton = document.getElementById('submit-button');
    const feedback = document.getElementById('feedback')
    submitButton.style.backgroundColor = 'green';
    submitButton.innerHTML = '<i class="fas fa-check" style="margin-right: 5px"></i> Review Complete'
    feedback.style.display = 'flex';
});

