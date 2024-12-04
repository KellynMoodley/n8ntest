document.addEventListener("DOMContentLoaded", () => {
  const thumbsUpBtn = document.getElementById("thumbsUp");
  const thumbsDownBtn = document.getElementById("thumbsDown");


  thumbsUpBtn.addEventListener("click", () => {
    feedbackMessage.textContent = "Thank you for your positive feedback! We're glad you like the content.";
    feedbackMessage.classList.remove("hidden");
    feedbackMessage.classList.add("text-green-600");
    thumbsUpBtn.classList.add("text-green-500");
    thumbsDownBtn.classList.remove("text-red-500");
  });

  thumbsDownBtn.addEventListener("click", () => {
    feedbackMessage.textContent = "We're sorry to hear that our system is not up to standard. This feedback will be used to improve this content.";
    feedbackMessage.classList.remove("hidden");
    feedbackMessage.classList.add("text-red-600");
    thumbsDownBtn.classList.add("text-red-500");
    thumbsUpBtn.classList.remove("text-green-500");
  });
});


// Update clock time every minute
function updateTime() {
    const clock = document.getElementById("clock");
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  setInterval(updateTime, 1000);
  updateTime();
  
  // Tab switching functionality
  function showTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(tab => {
      tab.classList.add("hidden");
    });
    document.getElementById(tabId).classList.remove("hidden");
  }
 // Sample data for sentiment analysis
const labels = ['Interaction 1', 'Interaction 2', 'Interaction 3', 'Interaction 4', 'Interaction 5'];
const positiveData = [30, 45, 20, 60, 50]; // Percentage of positive sentiment
const neutralData = [40, 30, 50, 20, 30];  // Percentage of neutral sentiment
const negativeData = [30, 25, 30, 20, 20]; // Percentage of negative sentiment

// Configuring the chart
const ctx = document.getElementById('sentimentChart').getContext('2d');
const sentimentChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Positive',
        data: positiveData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Neutral',
        data: neutralData,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Negative',
        data: negativeData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.dataset.label + ': ' + context.raw + '%';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Interactions',
        },
      },
    },
  },
}); 

// Function to trigger the file check
// script.js - Update the fetch URLs to match the backend endpoints
async function triggerFileCheck() {
  try {
      // Update the URL to include the correct port and path
      const response = await fetch('http://localhost:3000/check-file');
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('File check response:', data);

      // After successful file check, fetch webhook data
      const webhookResponse = await fetch('http://localhost:3000/webhook-data');
      if (!webhookResponse.ok) {
          throw new Error(`HTTP error! Status: ${webhookResponse.status}`);
      }
      const webhookData = await webhookResponse.json();
      console.log('Webhook response:', webhookData);
      // Now you can safely manipulate the DOM
      const resultElement = document.getElementById('result-container');
      resultElement.textContent = JSON.stringify(webhookData.response.text);

  } catch (error) {
      console.error('Error:', error);
      alert('Failed to process request. See console for details.');
  }
}

// Attach event listener to the button
document.getElementById('triggerFileCheckBtn').addEventListener('click', triggerFileCheck);


