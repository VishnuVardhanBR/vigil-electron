const machines = [
    { machineId: 'cnc-mill-1', machineName: 'CNC Mill #1' },
    { machineId: 'cnc-mill-2', machineName: 'CNC Mill #2' },
    { machineId: 'stamping-press-1', machineName: 'Stamping Press #1' },
    { machineId: 'robotic-arm-1', machineName: 'Robotic Arm #1' },
];

const baselineMetrics = {
    'cnc-mill': { temp: 75, pressure: 120, vibration: 0.5 },
    'stamping-press': { temp: 85, pressure: 150, vibration: 2.0 },
    'robotic-arm': { temp: 60, pressure: 80, vibration: 1.2 },
};

function getRandomValue(base, range) {
    return base + (Math.random() - 0.5) * range;
}

function generateDataPoint(machine) {
    const machineType = machine.machineId.split('-').slice(0, 2).join('-');
    const metricsConfig = baselineMetrics[machineType];

    let temp = getRandomValue(metricsConfig.temp, 10);
    let pressure = getRandomValue(metricsConfig.pressure, 20);
    let vibration = getRandomValue(metricsConfig.vibration, 0.4);
    let status = 'Normal';
    let logMessage = 'Operation normal.';

    const stateRoll = Math.random();
    if (stateRoll < 0.05) {
        status = 'Error';
        pressure *= 1.8;
        logMessage = '[CRITICAL] Pressure spike detected!';
    } else if (stateRoll < 0.20) {
        status = 'Warning';
        temp *= 1.3;
        logMessage = '[WARN] Temperature approaching critical limit.';
    }

    return {
        machineId: machine.machineId,
        machineName: machine.machineName,
        timestamp: new Date().toISOString(),
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
        const machineIndex = Math.floor(Math.random() * machines.length);
        const dataPoint = generateDataPoint(machines[machineIndex]);
        callback(dataPoint);
    }, 1500);
}

module.exports = { startDataGeneration, machines };