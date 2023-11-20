document.addEventListener('DOMContentLoaded', function () {
    const rollNumberInput = document.getElementById('rollNumber');
    rollNumberInput.focus();

    rollNumberInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            // Prevent the default form submission behavior
            event.preventDefault();
            downloadSlips();
        }
    });
});


function validateRollNumber(rollNumber) {
    const rollNumberPattern = /^[0-9]{5,6}$/;
    return rollNumberPattern.test(rollNumber);
}

function downloadSlips() {
    const rollNumber = document.getElementById('rollNumber').value;

    if (!rollNumber) {
        alert('Please enter a roll number.');
        return;
    }

    if (!validateRollNumber(rollNumber)) {
        alert('Please enter a valid 5 to 6 digit roll number.');
        return;
    }

    const apiUrl = `https://api_last-1-j0851899.deta.app/download_slip?roll_no=${rollNumber}`;

    // Display loading message
    document.getElementById('resultMessage').innerHTML = 'Downloading...';

    // Create form data
    const formData = new FormData();
    formData.append('roll_no', rollNumber);

    // Make the POST request
    fetch(apiUrl, {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error("The slip download failed. It's possible that the slip is not available because Punjab University hasn't uploaded it yet, you may not be registered, you may be dropped, or you may be alumni. Please check your registration status and try again later.");
            }
            return response.blob();
        })
        .then((blob) => {
            if (blob) {
                // Create a link element
                const link = document.createElement('a');
                // Set the href attribute to the object URL of the blob
                link.href = window.URL.createObjectURL(blob);
                // Set the download attribute to specify the file name
                link.download = `Slips ${rollNumber}.pdf`;
                // Append the link to the document body
                document.body.appendChild(link);
                // Trigger a click on the link to initiate the download
                link.click();
                // Remove the link from the document
                document.body.removeChild(link);
                // Release the object URL
                window.URL.revokeObjectURL(link.href);

                // Clear loading message
                document.getElementById('resultMessage').innerHTML = '';
                clearForm();
            } else {
                throw new Error("The slip download failed. It's possible that the slip is not available because Punjab University hasn't uploaded it yet, you may not be registered, you may be dropped, or you may be alumni. Please check your registration status and try again later.");
            }
        })
        .catch((error) => {
            console.error('Error:', error.message);
            // Display error message
            document.getElementById('resultMessage').innerHTML = error.message;
        });
}


function clearForm() {
    document.getElementById('rollNumber').value = '';
    document.getElementById('resultMessage').innerHTML = '';
}
