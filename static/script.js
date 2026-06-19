document.addEventListener("DOMContentLoaded", () => {

    const uploadCard = document.getElementById("uploadCard");
    const imageInput = document.getElementById("imageInput");
    const filenameDisplay = document.querySelector(".filename");
    const browseSpan = uploadCard.querySelector("span");
    const analyzeBtn = document.querySelector(".analyze-btn");

    const analysisPanel = document.getElementById("analysisPanel");
    const previewImage = document.getElementById("previewImage");
    const verdictBadge = document.getElementById("verdictBadge");
    const verdictText = document.getElementById("verdictText");
    const confidenceValue = document.getElementById("confidenceValue");
    const confidenceFill = document.getElementById("confidenceFill");
    const reasonsList = document.getElementById("reasonsList");

    // Browse click
    browseSpan.addEventListener("click", () => {
        imageInput.click();
    });

    // File selection
    imageInput.addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (!file) return;

        filenameDisplay.textContent = file.name;

        const reader = new FileReader();

        reader.onload = function(e) {

            previewImage.src = e.target.result;
            
            analysisPanel.style.display = "block";

            verdictBadge.textContent = "Ready";
            verdictText.textContent = "Image Selected";
            confidenceValue.textContent = "0";
            confidenceFill.style.width = "0%";

            reasonsList.innerHTML = `
                <li>Image loaded successfully.</li>
                <li>Click Analyze Image to run Gemini analysis.</li>
            `;
        };

        reader.readAsDataURL(file);
    });

    // Hover effects
    uploadCard.addEventListener("mouseenter", () => {
        uploadCard.classList.add("hover-effect");
    });

    uploadCard.addEventListener("mouseleave", () => {
        uploadCard.classList.remove("hover-effect");
    });

    // Drag over
    uploadCard.addEventListener("dragover", (event) => {
        event.preventDefault();
        uploadCard.classList.add("hover-effect");
    });

    uploadCard.addEventListener("dragleave", () => {
        uploadCard.classList.remove("hover-effect");
    });

    // Drop
    uploadCard.addEventListener("drop", (event) => {

        event.preventDefault();

        uploadCard.classList.remove("hover-effect");

        const files = event.dataTransfer.files;

        if (files.length > 0) {

            imageInput.files = files;

            filenameDisplay.textContent = files[0].name;

            const reader = new FileReader();

            reader.onload = function(e) {

                previewImage.src = e.target.result;

                analysisPanel.style.display = "block";
            };

            reader.readAsDataURL(files[0]);
        }
    });

    // Analyze
    analyzeBtn.addEventListener("click", async () => {

        if (!imageInput.files.length) {
            alert("Please select an image first.");
            return;
        }

        analyzeBtn.textContent = "Analyzing...";
        analyzeBtn.disabled = true;

        const formData = new FormData();
        formData.append("image", imageInput.files[0]);

        try {

            const response = await fetch("/analyze", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.error) {

                verdictBadge.textContent = "Error";
                verdictText.textContent = "Analysis Failed";

                reasonsList.innerHTML =
                    `<li>${result.error}</li>`;

            } else {

                verdictBadge.textContent = result.verdict;

                verdictText.textContent =
                    result.verdict;

                confidenceValue.textContent =
                    result.confidence;

                confidenceFill.style.width =
                    result.confidence + "%";

                reasonsList.innerHTML = "";

                result.reasons.forEach(reason => {

                    const li =
                        document.createElement("li");

                    li.textContent = reason;

                    reasonsList.appendChild(li);

                });

            }

        } catch (error) {

            verdictBadge.textContent = "Error";
            verdictText.textContent = "Request Failed";

            reasonsList.innerHTML =
                `<li>${error}</li>`;

        }

        analyzeBtn.textContent = "Analyze Image";
        analyzeBtn.disabled = false;

    });

});