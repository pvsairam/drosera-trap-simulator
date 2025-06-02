// Drosera Trap Simulator with Tabs for LiveBoard and RealTimeSimulator
import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './index.css';
import LiveBoard from './LiveBoard';
import RealTimeSimulator from './RealTimeSimulator';
import { pocPresets } from './pocPresets';

type POCPreset = {
  label: string;
  logic: string;
  event: string;
};

function App() {
  const trapPresets: POCPreset[] = pocPresets;

  const presetIndexRef = useRef(0);
  const [trapLogic, setTrapLogic] = useState(trapPresets[0].logic);
  const [simulatedEvent, setSimulatedEvent] = useState(trapPresets[0].event);
  const [output, setOutput] = useState<{ triggered: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'realtime' | 'simulator' | 'liveboard'>('realtime');

  const handleRunTrap = async () => {
    try {
      const event = JSON.parse(simulatedEvent);
      const fullCode = `(async () => { ${trapLogic}; return await trap(${JSON.stringify(event)}); })()`;
      const result = await eval(fullCode);
      setOutput(result
        ? { triggered: true, message: result }
        : { triggered: false, message: "Trap NOT TRIGGERED" });
    } catch (error: any) {
      setOutput({ triggered: false, message: `Error: ${error.message}` });
    }
  };

  const generateTrapAndEvent = () => {
    presetIndexRef.current = (presetIndexRef.current + 1) % trapPresets.length;
    const preset = trapPresets[presetIndexRef.current];
    setTrapLogic(preset.logic);
    setSimulatedEvent(preset.event);
    setOutput(null);
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.target.value);
    const preset = trapPresets[index];
    presetIndexRef.current = index;
    setTrapLogic(preset.logic);
    setSimulatedEvent(preset.event);
    setOutput(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-mono">
      <div className="flex items-center justify-center mt-6 mb-6">
        <img src="/drosera-logo.png" alt="Drosera Logo" className="w-8 h-8 mr-3" />
        <h1 className="text-3xl font-bold">Drosera Trap Simulator <span className="text-sm text-gray-400 ml-2">(Unofficial)</span></h1>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setActiveTab('realtime')} className={`px-4 py-2 rounded ${activeTab === 'realtime' ? 'bg-indigo-600' : 'bg-gray-700'}`}>Simulator</button>
        <button onClick={() => setActiveTab('simulator')} className={`px-4 py-2 rounded ${activeTab === 'simulator' ? 'bg-indigo-600' : 'bg-gray-700'}`}>POC Simulator</button>
        <button onClick={() => setActiveTab('liveboard')} className={`px-4 py-2 rounded ${activeTab === 'liveboard' ? 'bg-indigo-600' : 'bg-gray-700'}`}>Proof-of-Trap</button>
      </div>

      <main className="flex-grow px-6">
        {activeTab === 'simulator' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h2 className="text-xl mb-2">🧠 Trap Logic</h2>
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={trapLogic}
                  onChange={(val) => setTrapLogic(val || '')}
                  theme="vs-dark"
                />
              </div>
              <div>
                <h2 className="text-xl mb-2">🧱 Simulated Event</h2>
                <Editor
                  height="300px"
                  defaultLanguage="json"
                  value={simulatedEvent}
                  onChange={(val) => setSimulatedEvent(val || '')}
                  theme="vs-dark"
                />
              </div>
            </div>

            <div className="flex flex-col items-center mb-4">
              <select
                className="bg-gray-800 text-white p-2 rounded mb-1"
                onChange={handleDropdownChange}
                value={presetIndexRef.current}
              >
                {trapPresets.map((preset, index) => (
                  <option key={index} value={index}>{preset.label}</option>
                ))}
              </select>

              <div className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                <span>💡</span>
                <span>Use a predefined trap preset or edit the logic and event to create your own simulation.</span>
              </div>

              <span className="text-gray-300 mt-1">(or)</span>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <button
                onClick={generateTrapAndEvent}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white font-bold"
              >
                🧪 Generate Trap + Event
              </button>
              <button
                onClick={handleRunTrap}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-bold"
              >
                🚀 Run Trap
              </button>
            </div>

            {output && (
              <div className="bg-gray-800 p-4 rounded text-lg">
                <span className="font-bold">Result:</span>
                <span className={output.triggered ? "text-green-400" : "text-pink-400"}> {output.message}</span>
              </div>
            )}
          </>
        )}

        {activeTab === 'liveboard' && <LiveBoard />}
        {activeTab === 'realtime' && (
  <>
    <h2 className="text-lg text-yellow-300 font-semibold text-center mb-4">
      💡 Use a predefined trap preset or edit the logic and event to create your own simulation.
    </h2>
    <RealTimeSimulator />
  </>
)}

      </main>

      <footer className="text-center text-sm text-gray-400 pb-4">
        <div>
          Developed by <a href="https://x.com/xtestnet" className="underline text-blue-400">@xtestnet</a>
        </div>
        <div>
          © {new Date().getFullYear()} Drosera Trap Simulator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
