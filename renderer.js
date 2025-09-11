const { ipcRenderer } = require('electron');

const dataOutput = document.getElementById('data-output');

// Keep a buffer of the last few messages for each machine
const machineDataBuffer = {};
const MAX_BUFFER_SIZE = 10; // Keep last 10 messages per machine

ipcRenderer.on('machine-data', (event, data) => {
  console.log('Received data:', data);

  // Add data to buffer
  if (!machineDataBuffer[data.machineId]) {
    machineDataBuffer[data.machineId] = [];
  }
  machineDataBuffer[data.machineId].unshift(data); // Add to the front

  // Trim buffer if it's too long
  if (machineDataBuffer[data.machineId].length > MAX_BUFFER_SIZE) {
    machineDataBuffer[data.machineId].pop();
  }

  // Update the display with all buffered data
  updateDisplay();
});

function updateDisplay() {
    let outputHtml = '';
    for (const machineId in machineDataBuffer) {
        const dataPoints = machineDataBuffer[machineId];
        // Use the most recent datapoint for the header
        if(dataPoints.length > 0) {
            const latestData = dataPoints[0];
            outputHtml += `<h3>${latestData.machineName} (ID: ${machineId}) - Status: ${latestData.status}</h3>`;
            outputHtml += `<ul>`;
            dataPoints.forEach(dp => {
                outputHtml += `<li>${dp.timestamp}: ${dp.logMessage} | Temp: ${dp.metrics.temperature.value}°C, Pressure: ${dp.metrics.pressure.value} PSI, Vibration: ${dp.metrics.vibration.value}g</li>`;
            });
            outputHtml += `</ul>`;
        }
    }
    dataOutput.innerHTML = outputHtml;
}

// Initial message
dataOutput.innerHTML = '<h2>Waiting for machine data...</h2>';