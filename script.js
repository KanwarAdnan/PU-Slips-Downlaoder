document.addEventListener('DOMContentLoaded', function () {
    const rollNumberInput = document.getElementById('rollNumber');
    rollNumberInput.focus();

    rollNumberInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            // Prevent the default form submission behavior
            event.preventDefault();
            downloadResults();
        }
    });
});

function downloadSlips() {
    const rollNumber = document.getElementById('rollNumber').value;

    if (!rollNumber) {
        alert('Please enter a roll number.');
        return;
    }

    const apiUrl = `https://api_last-1-j0851899.deta.app/download_slip?roll_no=${rollNumber}`;

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
                throw new Error('Download failed. Please check your input.');
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
            } else {
                throw new Error('Download failed. Please check your input.');
            }
        })
        .catch((error) => {
            console.error('Error:', error.message);
            alert(error.message);
        });
}



function clearForm() {
    document.getElementById('rollNumber').value = '';
    document.getElementById('resultMessage').innerHTML = '';
}
