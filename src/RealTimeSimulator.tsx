import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { ethers } from 'ethers';
import { trapPresets } from './trapPresets';

const RealTimeSimulator: React.FC = () => {
  const [collectCode, setCollectCode] = useState(trapPresets[0].collect);
  const [respondCode, setRespondCode] = useState(trapPresets[0].shouldRespond);
  const [currentState, setCurrentState] = useState<any | null>(null);
  const [trapResult, setTrapResult] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const runTrapOnce = async () => {
    try {
      const collect = new Function('ethers', `${collectCode}; return collect;`)(ethers);
      const shouldRespond = new Function(`${respondCode}; return shouldRespond;`)();

      const state = await collect();
      setCurrentState(state);

      const result = shouldRespond(state);
      const status = result ? "⚠️ Triggered" : "✅ Safe";

      setTrapResult(result ? "⚠️ Trap Triggered!" : "✅ Trap NOT Triggered");
      setLog((prev) => [
        `${new Date().toLocaleTimeString()} → ${status}`,
        ...prev.slice(0, 9),
      ]);
    } catch (err: any) {
      setTrapResult("❌ Error: " + err.message);
    }
  };

  const startStream = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => runTrapOnce(), 5000);
  };

  const stopStream = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.target.value);
    const preset = trapPresets[index];
    setCollectCode(preset.collect);
    setRespondCode(preset.shouldRespond);
    setCurrentState(null);
    setTrapResult(null);
    setLog([]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🧪 Real-Time Trap Simulator (Live EVM)</h2>

      <div className="flex gap-4 items-center">
        <label className="text-lg font-semibold">Select Trap Preset:</label>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          onChange={handlePresetChange}
        >
          {trapPresets.map((preset, index) => (
            <option key={index} value={index}>{preset.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">🔍 collect()</h3>
          <Editor
            height="250px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={collectCode}
            onChange={(val) => setCollectCode(val || '')}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">🎯 shouldRespond(state)</h3>
          <Editor
            height="250px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={respondCode}
            onChange={(val) => setRespondCode(val || '')}
          />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={runTrapOnce}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          🚀 Run Trap Once
        </button>
        <button
          onClick={startStream}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          ▶️ Start Stream
        </button>
        <button
          onClick={stopStream}
          disabled={!isRunning}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          ⏸️ Stop Stream
        </button>
      </div>

      {currentState && (
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">📦 Current State</h3>
          <pre className="text-sm">{JSON.stringify(currentState, null, 2)}</pre>
        </div>
      )}

      {trapResult && (
        <div className="bg-gray-900 p-4 rounded text-lg">
          <span className="font-bold">Result:</span>
          <span className="ml-2 text-green-400">{trapResult}</span>
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">📜 Log (last 10)</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {log.map((item, index) => (
            <li key={index} className="text-gray-300">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RealTimeSimulator;
