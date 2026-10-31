import { useState } from 'react';

const GATES = {
  AND: { inputs: 2, fn: (a, b) => a && b },
  OR: { inputs: 2, fn: (a, b) => a || b },
  NAND: { inputs: 2, fn: (a, b) => !(a && b) },
  NOR: { inputs: 2, fn: (a, b) => !(a || b) },
  XOR: { inputs: 2, fn: (a, b) => a !== b },
  XNOR: { inputs: 2, fn: (a, b) => a === b },
  NOT: { inputs: 1, fn: (a) => !a },
};

function GateSymbol({ gate, a, b, output }) {
  // A small, schematic (not literal-shape-accurate) gate diagram — enough to
  // show signal flow and the live output state without a heavy diagram library.
  return (
    <svg viewBox="0 0 220 140" className="gate-symbol" role="img" aria-label={`${gate} gate diagram`}>
      <line x1="10" y1="45" x2="80" y2="45" stroke="var(--color-border-strong)" strokeWidth="2" />
      {GATES[gate].inputs === 2 && (
        <line x1="10" y1="95" x2="80" y2="95" stroke="var(--color-border-strong)" strokeWidth="2" />
      )}
      <circle cx="10" cy="45" r="5" fill={a ? 'var(--color-success)' : 'var(--color-border-strong)'} />
      {GATES[gate].inputs === 2 && (
        <circle cx="10" cy="95" r="5" fill={b ? 'var(--color-success)' : 'var(--color-border-strong)'} />
      )}
      <rect x="80" y="30" width="70" height="80" rx="10" fill="var(--color-bg-raised)" stroke="var(--color-accent)" strokeWidth="2" />
      <text x="115" y="76" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--color-text)">
        {gate}
      </text>
      <line x1="150" y1="70" x2="210" y2="70" stroke="var(--color-border-strong)" strokeWidth="2" />
      <circle cx="210" cy="70" r="7" fill={output ? 'var(--color-success)' : 'var(--color-border-strong)'} />
    </svg>
  );
}

export default function LogicGateSimulator({ defaultGate = 'AND' }) {
  const [gate, setGate] = useState(defaultGate);
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);

  const def = GATES[gate];
  const output = def.inputs === 2 ? def.fn(a, b) : def.fn(a);

  const truthRows =
    def.inputs === 2
      ? [
          [false, false],
          [false, true],
          [true, false],
          [true, true],
        ].map(([ta, tb]) => ({ a: ta, b: tb, out: def.fn(ta, tb) }))
      : [{ a: false, out: def.fn(false) }, { a: true, out: def.fn(true) }];

  return (
    <div className="gate-sim">
      <div className="gate-sim-controls">
        <select className="select" value={gate} onChange={(e) => setGate(e.target.value)} aria-label="Select gate type">
          {Object.keys(GATES).map((g) => (
            <option key={g} value={g}>
              {g} gate
            </option>
          ))}
        </select>
        <div className="gate-sim-toggles">
          <button className={`btn btn-sm ${a ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setA((v) => !v)}>
            A = {a ? '1' : '0'}
          </button>
          {def.inputs === 2 && (
            <button className={`btn btn-sm ${b ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setB((v) => !v)}>
              B = {b ? '1' : '0'}
            </button>
          )}
        </div>
      </div>

      <GateSymbol gate={gate} a={a} b={b} output={output} />

      <p className="gate-sim-output">
        Output: <strong className={output ? 'text-accent' : 'text-muted'}>{output ? '1' : '0'}</strong>
      </p>

      <h3 className="gate-sim-table-title">Truth table</h3>
      <table className="table">
        <thead>
          <tr>
            <th>A</th>
            {def.inputs === 2 && <th>B</th>}
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {truthRows.map((row, i) => (
            <tr key={i}>
              <td>{row.a ? 1 : 0}</td>
              {def.inputs === 2 && <td>{row.b ? 1 : 0}</td>}
              <td>{row.out ? 1 : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
