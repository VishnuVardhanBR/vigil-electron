// No imports needed; React and other libraries are loaded from the CDN
const { useState, useEffect } = React;

const STATUS_STYLES = {
    Normal: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    Warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    Error: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    Initializing: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' }
};

const Icon = ({ name, className }) => {
    const iconHtml = lucide.icons[name] ? lucide.icons[name].toSvg({ class: className }) : '';
    return <i dangerouslySetInnerHTML={{ __html: iconHtml }} />;
};

const MACHINE_ICONS = {
    'cnc-mill': <Icon name="drill" className="w-6 h-6 text-gray-500" />,
    'stamping-press': <Icon name="hard-hat" className="w-6 h-6 text-gray-500" />,
    'robotic-arm': <Icon name="bot" className="w-6 h-6 text-gray-500" />,
};

const getMachineIcon = (machineId) => {
    const type = machineId.split('-').slice(0, 2).join('-');
    return MACHINE_ICONS[type] || <Icon name="server" className="w-6 h-6 text-gray-500" />;
};

const Header = () => (
    <header className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-lg sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">VIGIL</h1>
        <div className="px-3 py-1.5 bg-white/70 border border-gray-200/80 rounded-md shadow-sm">
            <span className="text-sm font-medium text-gray-700">All Machines</span>
        </div>
    </header>
);

const Metric = ({ iconName, color, label, value, unit }) => (
    <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">
            <Icon name={iconName} className={`w-5 h-5 ${color}`} />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-800">{value} <span className="text-sm font-normal text-gray-500">{unit}</span></p>
        </div>
    </div>
);

const MachineCard = ({ machine }) => {
    const style = STATUS_STYLES[machine.status] || STATUS_STYLES.Initializing;
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">{getMachineIcon(machine.machineId)}<h2 className="text-lg font-bold text-gray-900">{machine.machineName}</h2></div>
                    <div className={`flex items-center px-3 py-1 rounded-full ${style.bg} ${style.text} text-xs font-semibold`}><span className={`w-2 h-2 mr-2 rounded-full ${style.dot}`}></span>{machine.status}</div>
                </div>
                <div className="space-y-4 mb-4">
                    <Metric iconName="thermometer" color="text-red-500" label="Temperature" value={machine.metrics.temperature.value} unit={machine.metrics.temperature.unit} />
                    <Metric iconName="gauge-circle" color="text-blue-500" label="Pressure" value={machine.metrics.pressure.value} unit={machine.metrics.pressure.unit} />
                    <Metric iconName="waves" color="text-purple-500" label="Vibration" value={machine.metrics.vibration.value} unit={machine.metrics.vibration.unit} />
                </div>
            </div>
            <div>
                <div className="mt-4 pt-4 border-t border-gray-200/80">
                    <p className="text-xs text-gray-600 truncate" title={machine.logMessage}>{machine.logMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">Last Update: {new Date(machine.timestamp).toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
    );
};

function App() {
    const [machines, setMachines] = useState({});

    useEffect(() => {
        window.api.on('initial-machines', (initialMachines) => {
            const machinesMap = initialMachines.reduce((acc, m) => ({ ...acc, [m.machineId]: m }), {});
            setMachines(machinesMap);
        });

        window.api.on('machine-data-update', (dataPoint) => {
            setMachines(prev => ({ ...prev, [dataPoint.machineId]: dataPoint }));
        });

        return () => {
            window.api.removeAllListeners('initial-machines');
            window.api.removeAllListeners('machine-data-update');
        };
    }, []);

    return (
        <div className="w-full h-full">
            <Header />
            <main className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Object.values(machines).map(m => <MachineCard key={m.machineId} machine={m} />)}
                </div>
            </main>
        </div>
    );
}