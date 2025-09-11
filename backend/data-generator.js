// backend/data-generator.js

const machines = [
    { machineId: 'cnc-mill-1', machineName: 'CNC Mill #1', status: 'Normal' },
    { machineId: 'cnc-mill-2', machineName: 'CNC Mill #2', status: 'Normal' },
    { machineId: 'stamping-press-1', machineName: 'Stamping Press #1', status: 'Normal' },
    { machineId: 'robotic-arm-1', machineName: 'Robotic Arm #1', status: 'Normal' },
];

const baselineMetrics = {
    'cnc-mill': { temp: { base: 75, range: 5 }, pressure: { base: 120, range: 10 }, vibration: { base: 0.5, range: 0.1 } },
    'stamping-press': { temp: { base: 85, range: 7 }, pressure: { base: 150, range: 15 }, vibration: { base: 2.0, range: 0.3 } },
    'robotic-arm': { temp: { base: 60, range: 4 }, pressure: { base: 80, range: 5 }, vibration: { base: 1.2, range: 0.2 } },
};

function getRandomValue(base, range) {
    return base + (Math.random() - 0.5) * range;
}

function generateDataPoint(machine) {
    const timestamp = new Date().toISOString();
    let status = 'Normal';
    let logMessage = 'Operation normal.';

    const machineType = machine.machineId.split('-')[0] + '-' + machine.machineId.split('-')[1];
    const metricsConfig = baselineMetrics[machineType] || baselineMetrics['cnc-mill']; // Default

    let temp = getRandomValue(metricsConfig.temp.base, metricsConfig.temp.range);
    let pressure = getRandomValue(metricsConfig.pressure.base, metricsConfig.pressure.range);
    let vibration = getRandomValue(metricsConfig.vibration.base, metricsConfig.vibration.range);

    const stateRoll = Math.random();

    if (stateRoll < 0.05) { // 5% chance of Error
        status = 'Error';
        const errorType = Math.floor(Math.random() * 2);
        if (errorType === 0) {
            pressure *= 1.8; // Dramatic spike
            logMessage = '[CRITICAL] Pressure spike detected! Possible line blockage.';
        } else {
            vibration *= 3;
            logMessage = '[CRITICAL] Excessive vibration detected! Emergency stop engaged.';
        }
    } else if (stateRoll < 0.20) { // 15% chance of Warning (5% + 15%)
        status = 'Warning';
        const warningType = Math.floor(Math.random() * 2);
        if (warningType === 0) {
            temp *= 1.3; // Drifting high
            logMessage = '[WARN] Temperature approaching critical limit.';
        } else {
            pressure *= 1.2;
            logMessage = '[WARN] Pressure levels are higher than normal.';
        }
    }

    return {
        machineId: machine.machineId,
        machineName: machine.machineName,
        timestamp,
        status,
        metrics: {
            temperature: { value: parseFloat(temp.toFixed(2)), unit: '°C' },
            pressure: { value: parseFloat(pressure.toFixed(2)), unit: 'PSI' },
            vibration: { value: parseFloat(vibration.toFixed(2)), unit: 'g' },
        },
        logMessage,
    };
}

function startDataGeneration(callback) {
    setInterval(() => {
        // Pick a random machine to update
        const machineIndex = Math.floor(Math.random() * machines.length);
        const machine = machines[machineIndex];

        const dataPoint = generateDataPoint(machine);
        callback(dataPoint);
    }, 1500); // Generate data every 1.5 seconds
}

module.exports = { startDataGeneration, machines };
