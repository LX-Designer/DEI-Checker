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
    resultsDiv.innerHTML = "<h2>Analysis Results</h2>";

    resultsDiv.innerHTML += `
        <h3>Document Text with Highlights:</h3>
        <div style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd;">
            ${data.highlighted_text}
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
