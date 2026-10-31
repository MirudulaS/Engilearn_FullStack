import { useRef } from 'react';

// This is a plain textarea-based editor so Phase 4 doesn't pull in a heavy
// dependency before it's needed. The insertion point for Monaco Editor later
// is exactly this component: swap the <textarea> below for a <MonacoEditor />
// and keep the same value/onChange contract.
export default function CodeEditor({ value, onChange, language }) {
  const textareaRef = useRef(null);
  const lineCount = value.split('\n').length;

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = textareaRef.current;
      const { selectionStart, selectionEnd } = el;
      const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      onChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = selectionStart + 2;
      });
    }
  }

  return (
    <div className="code-editor">
      <div className="code-editor-gutter" aria-hidden="true">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        className="code-editor-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        aria-label={`Code editor (${language})`}
      />
    </div>
  );
}
