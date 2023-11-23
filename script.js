document.addEventListener('DOMContentLoaded', function () {
    const rollNumberInput = document.getElementById('rollNumber');
    rollNumberInput.focus();

    rollNumberInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
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
    const slipType = document.getElementById('slipType').value; // Get the selected slip type
    const resultMessage = document.getElementById('resultMessage');

    if (!rollNumber) {
        resultMessage.innerHTML = 'Please enter a roll number.';
        return;
    }

    if (!validateRollNumber(rollNumber)) {
        resultMessage.innerHTML = 'Please enter a valid 5 to 6 digit roll number.';
        return;
    }

    let apiUrl;
    if (slipType === 'exam') {
        apiUrl = `https://api_last-1-j0851899.deta.app/download_slip?roll_no=${rollNumber}`;
    } else if (slipType === 'practical') {
        apiUrl = `https://api_last-1-j0851899.deta.app/download_practical_slip?roll_no=${rollNumber}`;
    }

    resultMessage.innerHTML = 'Downloading...';

    const formData = new FormData();
    formData.append('roll_no', rollNumber);

    fetch(apiUrl, {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error("Slip download failed. Please check your details and try again.");
            }
            return response.blob();
        })
        .then((blob) => {
            if (blob) {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${slipType.charAt(0).toUpperCase() + slipType.slice(1)}_Slips_${rollNumber}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(link.href);

                resultMessage.innerHTML = 'Download successful!';
                clearForm();
            } else {
                throw new Error("Slip download failed. Please try again later.");
            }
        })
        .catch((error) => {
            console.error('Error:', error.message);
            alert(error.message); // Display error alert
            resultMessage.innerHTML = '';
        });
}


function clearForm() {
    document.getElementById('rollNumber').value = '';
    document.getElementById('resultMessage').innerHTML = '';
}
