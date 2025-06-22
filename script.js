// Function to get URL parameters
function getURLParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Extract response_id and assignment_id from the URL
const responseID = getURLParameter('response_id');
const assignmentID = getURLParameter('assignment_id');

// Populate the form fields and handle missing IDs
document.addEventListener('DOMContentLoaded', function () {
  const errorContainer = document.getElementById('errorContainer');
  const container = document.querySelector('.container');
  let errors = [];

  // Check for missing response_id
  if (!responseID) {
    errors.push('ERROR: Response ID is missing');
  } else {
    document.getElementById('responseID').value = responseID;
  }

  // Check for missing assignment_id
  if (!assignmentID) {
    errors.push('ERROR: Assignment ID is missing');
  } else {
    document.getElementById('assignmentID').value = assignmentID;
  }

  // Handle errors
  if (errors.length > 0) {
    errorContainer.innerHTML = errors.join('<br>'); // Display all errors
    errorContainer.style.display = 'block'; // Make the error container visible
  } else {
    // If no errors, hide the error container and proceed with submission
    errorContainer.style.display = 'none';
    submitAndRedirect(); // Submit and redirect without delay
  }
});

// Google Sheets API URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbxKvPxsAW6xFaT3NsOd_DbwokPSCElRTwMSg_7k_gqEGRSLhQrVrZMXaFpenZLOcrhJ/exec';

// Add loading indicator HTML
const loadingIndicator = document.createElement('div');
loadingIndicator.innerHTML = 'Loading... Please wait.';
loadingIndicator.style.display = 'none';
loadingIndicator.style.fontSize = '20px';
loadingIndicator.style.textAlign = 'center';
document.body.appendChild(loadingIndicator);

// Handle form submission and redirect
function submitAndRedirect() {
  const form = document.getElementById('participantForm');

  // Double-check for missing IDs
  if (!responseID || !assignmentID) {
    alert('Cannot proceed: Required information is missing. Please check the URL and try again.');
    return;
  }

  const formData = new FormData(form);

  // Show loading indicator
  loadingIndicator.style.display = 'block';

  // Submit the form data to Google Sheets
  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => {
      if (response.ok) {
        console.log('Data submitted successfully!');
        
        // Construct the dynamic URL using the response_id
        const redirectURL = `https://research.sc/participant/login/dynamic/EDDE3E35-0080-4EF4-8C26-548B25924C51?response_id=${responseID}`; // URL TO TESTING PROJECT!
        
        // Delay the redirection after submission has completed
        setTimeout(function() {
          window.location.href = redirectURL;
        }, 5000); // Delay 5 second before redirecting to ensure submission is processed
      } else {
        console.error('Submission failed. Please try again.');
        alert('Failed to load the experiment. Please refresh the page and try again.');
        loadingIndicator.style.display = 'none'; // Hide loading indicator
      }
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert('An error occurred while submitting your data. Please refresh the page and try again.');
      loadingIndicator.style.display = 'none'; // Hide loading indicator
    });
}
