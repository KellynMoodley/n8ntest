// Frontend (script.js)
async function triggerFileCheck() {
  const resultElement = document.getElementById('result-container');
  const button = document.getElementById('triggerFileCheckBtn');

  // Disable button and show initial status
  button.disabled = true;
  button.textContent = 'Checking... (Step 1: Initiating Request)';
  resultElement.innerHTML = '<p>Starting file check process...</p>';

  try {
    // Step 2: Preparing Fetch
    button.textContent = 'Checking... (Step 2: Preparing Fetch)';
    resultElement.innerHTML += '<p>Preparing to fetch data from server...</p>';

    // Detailed fetch with additional configuration
    const response = await fetch('https://truworths-5d9b0467377c.herokuapp.com/check-file', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store'
    });

    // Step 3: Checking Response
    button.textContent = 'Checking... (Step 3: Checking Response)';
    resultElement.innerHTML += `<p>Response received. Status: ${response.status}</p>`;

    // Validate response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    // Step 4: Parsing JSON
    button.textContent = 'Checking... (Step 4: Parsing JSON)';
    resultElement.innerHTML += '<p>Parsing response data...</p>';

    const data = await response.json();
    console.log('Full response:', data);

    // Step 5: Processing Data
    button.textContent = 'Checking... (Step 5: Processing Data)';
    resultElement.innerHTML += `<p>Data received successfully. Full response: ${JSON.stringify(data, null, 2)}</p>`;

    // Final Step: Displaying Results
    button.textContent = 'Check File and Fetch Webhook Data';
    button.disabled = false;
    resultElement.innerHTML = `
      <h3>Webhook Response:</h3>
      <pre>${JSON.stringify(data, null, 2) || 'No data received'}</pre>
    `;

  } catch (error) {
    // Error Handling with Detailed Logging
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack
    });

    // Reset button and show error
    button.textContent = 'Check File and Fetch Webhook Data';
    button.disabled = false;
    
    resultElement.innerHTML = `
      <h3>Error Occurred:</h3>
      <p>Message: ${error.message}</p>
      <p>Stack Trace: ${error.stack}</p>
    `;
  }
}

// Ensure DOM is fully loaded before adding event listener
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('triggerFileCheckBtn');
  if (button) {
    button.addEventListener('click', triggerFileCheck);
    console.log('Button event listener added successfully');
  } else {
    console.error('Button not found in the document');
  }
});
