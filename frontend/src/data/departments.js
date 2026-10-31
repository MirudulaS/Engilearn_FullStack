// Mock department data.
// This will later be served by GET /api/departments from the MERN backend.

export const departments = [
  {
    id: 'it',
    code: 'IT',
    name: 'Information Technology',
    shortName: 'IT / CS',
    description:
      'Web development, programming fundamentals, data structures, databases, and full-stack engineering.',
    moduleCount: 34,
    problemCount: 128,
    skillCategories: ['HTML & CSS', 'JavaScript', 'React', 'Node.js', 'Databases'],
    accentVar: '--color-dept-it',
    categories: [
      { id: 'web-development', name: 'Web Development', moduleCount: 12, problemCount: 46, description: 'HTML, CSS, JavaScript, React, and Node.js — the full front-to-back web stack.' },
      { id: 'programming-fundamentals', name: 'Programming Fundamentals', moduleCount: 6, problemCount: 20, description: 'Variables, control flow, functions, and core problem-solving patterns.' },
      { id: 'data-structures', name: 'Data Structures', moduleCount: 5, problemCount: 18, description: 'Arrays, linked lists, trees, graphs, and the operations built on top of them.' },
      { id: 'database-systems', name: 'Database Systems', moduleCount: 4, problemCount: 14, description: 'Relational modeling, SQL, and an introduction to NoSQL data stores.' },
      { id: 'backend-development', name: 'Backend Development', moduleCount: 4, problemCount: 16, description: 'REST APIs, middleware, authentication concepts, and server architecture.' },
      { id: 'full-stack-development', name: 'Full Stack Development', moduleCount: 2, problemCount: 8, description: 'Connecting a React frontend to an Express/MongoDB backend end to end.' },
      { id: 'software-engineering', name: 'Software Engineering', moduleCount: 1, problemCount: 6, description: 'Version control, testing basics, and working with a codebase over time.' },
    ],
  },
  {
    id: 'ece',
    code: 'ECE',
    name: 'Electronics and Communication Engineering',
    shortName: 'ECE',
    description:
      'Digital electronics, VLSI, Verilog HDL, embedded systems, and communication systems.',
    moduleCount: 27,
    problemCount: 96,
    skillCategories: ['Digital Logic', 'VLSI', 'Verilog', 'Embedded Systems', 'IoT'],
    accentVar: '--color-dept-ece',
    categories: [
      { id: 'digital-electronics', name: 'Digital Electronics', moduleCount: 5, problemCount: 20, description: 'Logic gates, boolean algebra, combinational and sequential circuits.' },
      { id: 'vlsi', name: 'VLSI', moduleCount: 6, problemCount: 16, description: 'CMOS fundamentals, flip-flops, counters, registers, and RTL design.' },
      { id: 'verilog-hdl', name: 'Verilog HDL', moduleCount: 4, problemCount: 14, description: 'Modules, testbenches, and simulation for hardware description.' },
      { id: 'embedded-systems', name: 'Embedded Systems', moduleCount: 4, problemCount: 12, description: 'Microcontroller programming concepts, GPIO, and timers.' },
      { id: 'microcontrollers', name: 'Microcontrollers', moduleCount: 2, problemCount: 8, description: 'Architecture and programming of common microcontroller families.' },
      { id: 'communication-systems', name: 'Communication Systems', moduleCount: 2, problemCount: 8, description: 'Modulation, transmission, and the basics of signal communication.' },
      { id: 'signals-and-systems', name: 'Signals and Systems', moduleCount: 2, problemCount: 8, description: 'Signal representation, transforms, and system response.' },
      { id: 'iot', name: 'IoT', moduleCount: 1, problemCount: 6, description: 'Sensor-data workflows, MQTT concepts, and device communication.' },
      { id: 'semiconductor-fundamentals', name: 'Semiconductor Fundamentals', moduleCount: 1, problemCount: 4, description: 'Diodes, transistors, and the physics behind digital logic.' },
    ],
  },
  {
    id: 'eee',
    code: 'EEE',
    name: 'Electrical and Electronics Engineering',
    shortName: 'EEE',
    description:
      'Circuit analysis, electrical machines, power systems, control systems, and power electronics.',
    moduleCount: 22,
    problemCount: 74,
    skillCategories: ['Circuit Analysis', 'Power Systems', 'Control Systems', 'Power Electronics'],
    accentVar: '--color-dept-eee',
    categories: [
      { id: 'circuit-analysis', name: 'Circuit Analysis', moduleCount: 5, problemCount: 18, description: "Ohm's law, Kirchhoff's laws, and DC/AC circuit analysis techniques." },
      { id: 'digital-electronics-eee', name: 'Digital Electronics', moduleCount: 3, problemCount: 12, description: 'Boolean logic and digital circuit fundamentals for electrical systems.' },
      { id: 'electrical-machines', name: 'Electrical Machines', moduleCount: 4, problemCount: 14, description: 'Transformers, motors, and generator fundamentals with worked calculations.' },
      { id: 'power-systems', name: 'Power Systems', moduleCount: 4, problemCount: 12, description: 'Generation, transmission, and distribution of electrical power.' },
      { id: 'control-systems', name: 'Control Systems', moduleCount: 3, problemCount: 10, description: 'Feedback, stability, and system response fundamentals.' },
      { id: 'power-electronics', name: 'Power Electronics', moduleCount: 2, problemCount: 6, description: 'Converters, rectifiers, and switching device fundamentals.' },
      { id: 'microcontrollers-eee', name: 'Microcontrollers', moduleCount: 1, problemCount: 2, description: 'Microcontroller basics applied to electrical control systems.' },
    ],
  },
];

export function getDepartmentById(id) {
  return departments.find((d) => d.id === id);
}
