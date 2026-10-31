import { useState } from 'react';

const STEP_WIDTH = 40;
const MAX_HISTORY = 8;

// Draws a step waveform for a boolean history array across a fixed-width track.
function Waveform({ history, label, color }) {
  const width = STEP_WIDTH * MAX_HISTORY;
  let path = '';
  history.forEach((value, i) => {
    const x = i * STEP_WIDTH;
    const y = value ? 8 : 28;
    path += i === 0 ? `M${x},${y} ` : `L${x},${y} `;
    path += `L${x + STEP_WIDTH},${y} `;
  });

  return (
    <div className="waveform-row">
      <span className="waveform-row-label">{label}</span>
      <svg viewBox={`0 0 ${width} 40`} className="waveform-svg" preserveAspectRatio="none">
        <path d={path} fill="none" stroke={color} strokeWidth="2" />
      </svg>
    </div>
  );
}

export default function FlipFlopWaveform() {
  const [d, setD] = useState(true);
  const [rstN, setRstN] = useState(true);
  const [clkHistory, setClkHistory] = useState([false]);
  const [dHistory, setDHistory] = useState([true]);
  const [qHistory, setQHistory] = useState([false]);
  const [q, setQ] = useState(false);

  function pushClipped(history, value) {
    const next = [...history, value];
    return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
  }

  function stepClock() {
    // Simulate one rising edge: q captures d, unless the async reset is held low.
    const nextQ = rstN ? d : false;
    setQ(nextQ);
    setClkHistory((h) => pushClipped(pushClipped(h, false), true));
    setDHistory((h) => pushClipped(pushClipped(h, d), d));
    setQHistory((h) => pushClipped(pushClipped(h, q), nextQ));
  }

  function handleResetToggle() {
    const next = !rstN;
    setRstN(next);
    if (!next) {
      setQ(false);
      setClkHistory((h) => pushClipped(h, false));
      setDHistory((h) => pushClipped(h, d));
      setQHistory((h) => pushClipped(h, false));
    }
  }

  function handleClear() {
    setClkHistory([false]);
    setDHistory([d]);
    setQHistory([false]);
    setQ(false);
    setRstN(true);
  }

  return (
    <div className="ff-sim">
      <div className="ff-sim-controls">
        <button className={`btn btn-sm ${d ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setD((v) => !v)}>
          D = {d ? '1' : '0'}
        </button>
        <button
          className={`btn btn-sm ${rstN ? 'btn-secondary' : 'btn-danger'}`}
          onClick={handleResetToggle}
        >
          rst_n = {rstN ? '1' : '0'}
        </button>
        <button className="btn btn-primary btn-sm" onClick={stepClock}>
          Step clock (posedge)
        </button>
        <button className="btn btn-ghost btn-sm" onClick={handleClear}>
          Clear
        </button>
      </div>

      <div className="ff-sim-waves">
        <Waveform history={clkHistory} label="clk" color="var(--color-text-faint)" />
        <Waveform history={dHistory} label="d" color="var(--color-accent)" />
        <Waveform history={qHistory} label="q" color="var(--color-success)" />
      </div>

      <p className="ff-sim-state">
        Current q = <strong className={q ? 'text-accent' : 'text-muted'}>{q ? '1' : '0'}</strong>
        {!rstN && <span className="text-muted"> (held low by asynchronous reset)</span>}
      </p>
    </div>
  );
}
