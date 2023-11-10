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
    const semester = document.getElementById('semester').value;

    if (!rollNumber) {
        alert('Please enter a roll number.');
        return;
    }

    // Adjust the URL using template literals
    const apiUrl = `https://api_last-1-j0851899.deta.app/generate_pdf?roll_no=${rollNumber}&result_code=${getResultCode(semester)}`;
    
    // Create form data
    const formData = new FormData();
    formData.append('roll_no', rollNumber);
    formData.append('result_code', getResultCode(semester));

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
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = Slip ${rollNumber} - Semester ${semester}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
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
    document.getElementById('semester').value = '1';
    document.getElementById('resultMessage').innerHTML = '';
}

function getResultCode(semester) {
    switch (semester) {
        case '1':
            return 'bsfydp_i_g23';
        case '2':
            return 'bsfydp_ii_g23';
        case '3':
            return 'bsfydp_iii_g23';
        case '4':
            return 'bsfydp_iv_g23';
        case '5':
            return 'bsfydp_v_g23';
        case '6':
            return 'bsfydp_vi_g23';
        case '7':
            return 'bsfydp_vii_g23';
        case '8':
            return 'bsfydp_viii_g23';
        default:
            return 'default_result_code';
    }
}
