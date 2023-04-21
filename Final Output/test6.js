var dataRecieved;

// Upload Image
const submitBtn = document.getElementById('upload-button');
submitBtn.addEventListener('click', () => {

    clearTables();

    const fileInput = document.getElementById('imageFile');
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const fileContent = reader.result;
        // Do something with the file content, such as sending it to a server
        const imgElement = document.getElementById('preview-image');
        imgElement.src = fileContent;
        document.querySelector('.image-container').appendChild(imgElement);
        imgElement.style.display = 'inline';
    }
});




// Submit Uploaded Image
function submitImage() {


    const url = 'http://202.46.3.73:8001/files'; // replace this with your backend URL
    const fileInput = document.getElementById('imageFile');

    // Check if file input element exists
    if (!fileInput) {
        console.error('File input element not found');
        return;
    }

    const formData = new FormData();
    formData.append('test', fileInput.files[0]);

    const options = {
        method: 'POST',
        body: formData
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            // process the response data here
            console.log("success_upload");
            console.log(data);
            dataRecieved = data;
            showAgeAndGender();
        })
        .catch(error => {
            console.error(error);
        });
}

// Capture Image
const takePictureBtn = document.querySelector('.take-a-picture');
const videoElement = document.createElement('video');
videoElement.setAttribute('autoplay', '');
videoElement.classList.add('camera-preview');

takePictureBtn.addEventListener('click', () => {
    clearTables();

    document.getElementById("upload-button").style.display = 'none';
    document.getElementById("submit-button").style.display = 'none';

    navigator.mediaDevices.getUserMedia({
            video: true
        })
        .then((stream) => {
            videoElement.srcObject = stream;
            videoElement.play();
        })
        .catch((error) => {
            console.error('Error accessing camera: ', error);
        });

    const previewDiv = document.createElement('div');
    previewDiv.classList.add('camera-preview-container');

    const contentDiv = document.querySelector('.input-image');
    contentDiv.innerHTML = '';
    contentDiv.appendChild(previewDiv);
    previewDiv.appendChild(videoElement);

    const captureBtn = document.createElement('button');
    captureBtn.setAttribute('id', 'capture-button');
    captureBtn.classList.add('button');
    captureBtn.textContent = 'Capture';
    previewDiv.appendChild(captureBtn);

    captureBtn.addEventListener('click', () => {
        const canvasElement = document.createElement('canvas');
        const ctx = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        // const fileContent = canvasElement.toDataURL();
        const fileContent = canvasElement.toDataURL('image/jpeg');

        const imgElement = document.getElementById('preview-image');
        imgElement.src = fileContent;
        document.querySelector('.image-container').appendChild(imgElement);
        imgElement.style.display = 'inline';

        // Create Submit Button
        const submitCaptureBtn = document.createElement('button');
        submitCaptureBtn.setAttribute('id', 'submit-capture-button');
        submitCaptureBtn.classList.add('button');
        submitCaptureBtn.textContent = 'Submit Captured';
        previewDiv.appendChild(submitCaptureBtn);

        submitCaptureBtn.addEventListener('click', (event) => {
            event.preventDefault();
            sendImageToBackend(fileContent);
            contentDiv.removeChild(previewDiv);
        });

    });
});



// submit for capture
function sendImageToBackend(fileContent) {
    // Create a new FormData object
    const url = 'http://202.46.3.73:8001/files';
    // const fileInput = document.getElementById('preview-image');

    //add rully 20240413
    // Convert the data to a Blob object
    var blob = dataURItoBlob(fileContent);

    const formData = new FormData();


    // Add the image data to the form data
    //formData.append('test', fileContent);
    //modif rully 20240413
    formData.append('test', blob, 'image_from_webcam.jpg');

    // Send a POST request to the backend endpoint
    fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to send image to backend');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response from the backend
            console.log("success_capture");
            console.log(data);
            dataRecieved = data;
            showAgeAndGender();
        })
        .catch(error => {
            // Handle any errors that occurred during the request
            console.error(error);
        });
}

// function downloadImage(dataUrl, fileName) {
//     const link = document.createElement('a');
//     link.href = dataUrl;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }

//add rully 20240413
// Function to convert data URI to Blob object
function dataURItoBlob(dataURI) {
    // Split the data URI into metadata and data parts
    var parts = dataURI.split(';');
    var mime = parts[0].split(':')[1];
    var data = parts[1].split(',')[1];

    // Convert the data to a binary string
    var binaryString = window.atob(data);

    // Create a new Uint8Array with the binary string data
    var array = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        array[i] = binaryString.charCodeAt(i);
    }

    // Create a new Blob object with the binary data and MIME type
    return new Blob([array], {
        type: mime
    });
}


// Show Age and Gender
function showAgeAndGender() {
    // Create Age class div
    const maxElementIndexAge = dataRecieved['age'].indexOf(Math.max(...dataRecieved['age']));
    inputAge(dataRecieved['age_labels'][maxElementIndexAge]);

    // Input Gender
    // console.log(dataRecieved['age']);
    const maxElementIndex = dataRecieved['gender'].indexOf(Math.max(...dataRecieved['gender']));
    // for (let i = 0; i < length())
    inputGender(dataRecieved['gender_labels'][maxElementIndex]);


    // Table 
    // Assuming that the data is in the dataReceived object as dataReceived['age'] and dataReceived['age_labels']
    const ageData = dataRecieved['age'];
    const ageLabels = dataRecieved['age_labels'];
    const genderData = dataRecieved['gender'];
    const genderLabels = dataRecieved['gender_labels'];
    inputAgeTable(ageData, ageLabels);
    inputGenderTable(genderData, genderLabels);

}

function inputGender(gender) {
    document.getElementById("output-1").getElementsByTagName("input")[0].value = gender;
}

function inputAge(age) {
    document.getElementById("output-2").getElementsByTagName("input")[0].value = age;
}


// Age Table
function inputAgeTable(ageData, ageLabels) {
    // Select the table element from the HTML document
    const table_age = document.getElementById("age-table");

    // Create the table header row
    const headerRow = document.createElement("tr");
    const headerLabelCell = document.createElement("th");
    headerLabelCell.textContent = "Age Labels";
    headerRow.appendChild(headerLabelCell);
    const headerValueCell = document.createElement("th");
    headerValueCell.textContent = "Confidence percent";
    headerRow.appendChild(headerValueCell);
    table_age.appendChild(headerRow);

    // Loop through the age data and create table rows
    ageData.forEach((ageValue, index) => {
        const row = document.createElement("tr");

        // Create the age label cell
        const labelCell = document.createElement("td");
        labelCell.textContent = ageLabels[index];
        row.appendChild(labelCell);

        // Create the age value cell
        const valueCell = document.createElement("td");
        let ageValueNum = Number(ageValue);
        ageValueNum *= 100;
        valueCell.textContent = ageValueNum;
        row.appendChild(valueCell);

        // Add the row to the table
        table_age.appendChild(row);
    });
}


// Gender Table
function inputGenderTable(ageData, ageLabels) {
    // Select the table element from the HTML document
    const table_gender = document.getElementById("gender-table");

    // Create the table header row
    const headerRow = document.createElement("tr");
    const headerLabelCell = document.createElement("th");
    headerLabelCell.textContent = "Gender Labels";
    headerRow.appendChild(headerLabelCell);
    const headerValueCell = document.createElement("th");
    headerValueCell.textContent = "Confidence percent";
    headerRow.appendChild(headerValueCell);
    table_gender.appendChild(headerRow);

    // Loop through the age data and create table rows
    ageData.forEach((ageValue, index) => {
        const row = document.createElement("tr");

        // Create the age label cell
        const labelCell = document.createElement("td");
        labelCell.textContent = ageLabels[index];
        row.appendChild(labelCell);

        // Create the age value cell
        const valueCell = document.createElement("td");
        let genderValueNum = Number(ageValue);
        genderValueNum *= 100;
        valueCell.textContent = genderValueNum;
        row.appendChild(valueCell);

        // Add the row to the table
        table_gender.appendChild(row);
    });
}

function clearTables() {
    const ageTable = document.getElementById('age-table');
    const genderTable = document.getElementById('gender-table');

    ageTable.innerHTML = '';
    genderTable.innerHTML = '';
}
