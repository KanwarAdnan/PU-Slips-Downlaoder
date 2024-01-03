document.addEventListener('DOMContentLoaded', function () {
   const rollNumberInput = document.getElementById('rollNumber');
   rollNumberInput.focus();

   // Wake up API
   // https://kanwaradnanpusms-vvicnw7txq-uc.a.run.app/
   fetch('https://api_last-1-j0851899.deta.app/')
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

   const apiUrl = getApiUrl(slipType, rollNumber);
   resultMessage.innerHTML = 'Processing, Download will begin shortly...'; // Display processing message

   // Create a form and submit it
   const form = document.createElement('form');
   form.method = 'post';
   form.action = apiUrl;

   const hiddenField = document.createElement('input');
   hiddenField.type = 'hidden';
   hiddenField.name = 'roll_no';
   hiddenField.value = rollNumber;

   form.appendChild(hiddenField);
   document.body.appendChild(form);

   form.submit();

   // Clean up
   document.body.removeChild(form);
   // resultMessage.innerHTML = 'Download initiated!';
   // clearForm();
}



function getApiUrl(slipType, rollNumber) {
   // Old API URL
   const baseUrl = 'https://api_last-1-j0851899.deta.app/';

   // const baseUrl = 'https://kanwaradnanpusms-vvicnw7txq-uc.a.run.app/';

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


