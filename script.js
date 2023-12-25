document.addEventListener('DOMContentLoaded', function () {
   const rollNumberInput = document.getElementById('rollNumber');
   rollNumberInput.focus();

   // Wake up API
   fetch('https://kanwaradnanpusms-vvicnw7txq-uc.a.run.app/')
      .then(response => console.log('API is awake'))
      .catch(error => console.error('Error:', error));

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
   const rollNumberInput = document.getElementById('rollNumber');
   const rollNumber = rollNumberInput.value;
   const slipType = document.getElementById('slipType').value;
   const resultMessage = document.getElementById('resultMessage');

   if (!rollNumber) {
      resultMessage.innerHTML = 'Please enter a roll number.';
      return;
   }

   if (!validateRollNumber(rollNumber)) {
      resultMessage.innerHTML = 'Please enter a valid 5 to 6 digit roll number.';
      return;
   }

   const apiUrl = getApiUrl(slipType, rollNumber);
   resultMessage.innerHTML = 'Processing, Download will begin shortly...';

   // Create a data object for the request body
   const data = {
      roll_no: rollNumber
   };

   // Use Fetch API to make a POST request with headers
   fetch(apiUrl, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
   .then(response => {
      if (!response.ok) {
         throw new Error(`Please Check your registeration status`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/pdf')) {
         return response.blob();
      } else {
         throw new Error(`Invalid content type: ${contentType}`);
      }
   })
   .then(blob => {
      // Create a download link for the blob data (PDF)
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloaded_slip.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Display download successful message
      resultMessage.innerHTML = 'Download successful!';
      clearForm();
   })
   .catch(error => {
      // Handle errors
      console.error('Error:', error.message);
      resultMessage.innerHTML = `Error during download: ${error.message}.`;
   });
}


function getApiUrl(slipType, rollNumber) {
   // Old API URL
   // const baseUrl = 'https://api_last-1-j0851899.deta.app/';

   const baseUrl = 'https://kanwaradnanpusms-vvicnw7txq-uc.a.run.app/';

   if (slipType === 'exam') {
      return `${baseUrl}download_slip`;
   } else if (slipType === 'adp') {
      return `${baseUrl}download_adp_slip`;
   } else if (slipType === 'prc') {
      return `${baseUrl}download_practical_slip`; // fixed
   }
}

function clearForm() {
   document.getElementById('rollNumber').value = '';
   document.getElementById('resultMessage').innerHTML = '';
   const rollNumberInput = document.getElementById('rollNumber');
   rollNumberInput.focus();
}


