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

   // Create a form dynamically for a POST request
   const form = document.createElement('form');
   form.style.display = 'none';
   form.method = 'POST';
   form.action = apiUrl;

   const input = document.createElement('input');
   input.type = 'hidden';
   input.name = 'roll_no';
   input.value = rollNumber;

   form.appendChild(input);
   document.body.appendChild(form);

   // Submit the form
   form.submit();

   // Clean up the form after submission
   document.body.removeChild(form);

   // Display download successful message after a delay to simulate processing
   setTimeout(() => {
      resultMessage.innerHTML = 'Download successful!';
      clearForm();

      // Display the manual download message
      const manualDownloadMessage = document.createElement('p');
      manualDownloadMessage.innerHTML = `Slip for ${rollNumber} did not download automatically? You can <a href="#" id="manualDownloadLink">click here</a> for manual download.`;

      // Create a close button for manual download
      const closeButton = document.createElement('button');
      closeButton.innerText = 'Close';
      closeButton.className = 'close-button'; // Add the close button class
      closeButton.addEventListener('click', function () {
         // Remove the manual download message and the close button
         resultMessage.removeChild(manualDownloadMessage);
         resultMessage.removeChild(closeButton);
      });

      // Create and append the manual download link and the close button
      resultMessage.appendChild(manualDownloadMessage);
      resultMessage.appendChild(closeButton);

      const manualDownloadLink = document.getElementById('manualDownloadLink');
      manualDownloadLink.addEventListener('click', function () {
         // Create and submit the same form for manual download
         const manualForm = document.createElement('form');
         manualForm.style.display = 'none';
         manualForm.method = 'POST';
         manualForm.action = apiUrl;
   
         const manualInput = document.createElement('input');
         manualInput.type = 'hidden';
         manualInput.name = 'roll_no';
         manualInput.value = rollNumber;
   
         manualForm.appendChild(manualInput);
         document.body.appendChild(manualForm);
   
         // Display "Downloading..." during the manual form submission
         const manualDownloadingMessage = document.createElement('p');
         manualDownloadingMessage.innerHTML = 'Downloading...';
         resultMessage.appendChild(manualDownloadingMessage);
   
         // Submit the manual form
         manualForm.submit();
   
         // Clean up the manual form after submission
         document.body.removeChild(manualForm);
   
         // Remove the "Downloading..." message
         resultMessage.removeChild(manualDownloadingMessage);
      });
   }, 1500); // Adjust the delay (in milliseconds) as needed
}

function getApiUrl(slipType, rollNumber) {
   // Old API URL
   // const oldBaseUrl = 'https://api_last-1-j0851899.deta.app/';

   const baseUrl = 'https://kanwaradnanpusms-vvicnw7txq-uc.a.run.app/';

   if (slipType === 'exam') {
      return `${baseUrl}download_slip?roll_no=${rollNumber}`;
   } else if (slipType === 'practical') {
      return `${baseUrl}download_practical_slip?roll_no=${rollNumber}`;
   } else if (slipType === 'adp') {
      return `${baseUrl}download_adp_slip?roll_no=${rollNumber}`;
   }
}

function clearForm() {
   document.getElementById('rollNumber').value = '';
   document.getElementById('resultMessage').innerHTML = '';
   const rollNumberInput = document.getElementById('rollNumber');
   rollNumberInput.focus();
}


