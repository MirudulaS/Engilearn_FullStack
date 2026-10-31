import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Play, Send, RotateCcw, WandSparkles } from 'lucide-react';
import { getProblem } from '../../services/problemService';
import { languages, getLanguageById } from '../../data/languages';
import { runCode, submitCode } from '../../services/compilerService';
import LanguageSelector from '../../components/compiler/LanguageSelector';
import CodeEditor from '../../components/compiler/CodeEditor';
import ProblemPanel from '../../components/compiler/ProblemPanel';
import TestCasePanel from '../../components/compiler/TestCasePanel';
import OutputPanel from '../../components/compiler/OutputPanel';
import SubmissionStatus from '../../components/compiler/SubmissionStatus';
import { LoadingState } from '../../components/common/States';
import './Compiler.css';

const TABS = ['Test Cases', 'Console', 'Result'];

export default function Compiler() {
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get('problem');
  const [problem, setProblem] = useState(null);
  const [problemLoading, setProblemLoading] = useState(!!problemId);

  useEffect(() => {
    if (!problemId) {
      setProblem(null);
      return;
    }
    setProblemLoading(true);
    getProblem(problemId)
      .then(setProblem)
      .catch(() => setProblem(null))
      .finally(() => setProblemLoading(false));
  }, [problemId]);

  const initialLanguage = useMemo(() => {
    const problemLangs = problem?.starterCode ? Object.keys(problem.starterCode) : [];
    const match = problemLangs.find((l) => languages.some((lang) => lang.id === l));
    return match ?? 'javascript';
  }, [problem]);

  const [language, setLanguage] = useState(initialLanguage);
  const [codeByLanguage, setCodeByLanguage] = useState({});
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('Test Cases');
  const [runStatus, setRunStatus] = useState('idle'); // idle | running | ran
  const [runResult, setRunResult] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | submitting | submitted
  const [submitResult, setSubmitResult] = useState(null);

  function starterFor(lang) {
    return problem?.starterCode?.[lang] ?? getLanguageById(lang)?.starter ?? '';
  }

  useEffect(() => {
    setCodeByLanguage((prev) => ({ ...prev, [initialLanguage]: prev[initialLanguage] ?? starterFor(initialLanguage) }));
    setLanguage(initialLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem?.id]);

  const code = codeByLanguage[language] ?? starterFor(language);

  function setCode(next) {
    setCodeByLanguage((prev) => ({ ...prev, [language]: next }));
  }

  function handleLanguageChange(next) {
    setLanguage(next);
    setCodeByLanguage((prev) => ({ ...prev, [next]: prev[next] ?? starterFor(next) }));
  }

  function handleReset() {
    setCodeByLanguage((prev) => ({ ...prev, [language]: starterFor(language) }));
    setRunStatus('idle');
    setRunResult(null);
    setSubmitStatus('idle');
    setSubmitResult(null);
  }

  function handleFormat() {
    // Real formatting depends on the language toolchain (Prettier, clang-format, etc.)
    // which will be wired up alongside the real compiler backend. For now this
    // normalizes trailing whitespace and collapses blank-line runs.
    const formatted = code
      .split('\n')
      .map((line) => line.replace(/\s+$/, ''))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');
    setCode(formatted);
  }

  async function handleRun() {
    setActiveTab('Console');
    setRunStatus('running');
    const result = await runCode({ language, code, input });
    setRunResult(result);
    setRunStatus('ran');
  }

  async function handleSubmit() {
    setActiveTab('Result');
    setSubmitStatus('submitting');
    const result = await submitCode({
      problemId: problem?.id,
      language,
      code,
      testCases: problem?.examples ?? [],
    });
    setSubmitResult(result);
    setSubmitStatus('submitted');
  }

  return (
    <div className="compiler-page">
      <div className="compiler-pane compiler-pane--left">
        {problemLoading ? (
          <LoadingState message="Loading problem…" />
        ) : (
          <ProblemPanel problem={problem} />
        )}
      </div>

      <div className="compiler-pane compiler-pane--center">
        <div className="compiler-toolbar">
          <LanguageSelector value={language} onChange={handleLanguageChange} />
          <div className="compiler-toolbar-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleFormat}>
              <WandSparkles size={15} />
              Format
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>
              <RotateCcw size={15} />
              Reset
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleRun} disabled={runStatus === 'running'}>
              <Play size={15} />
              Run
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={submitStatus === 'submitting'}>
              <Send size={15} />
              Submit
            </button>
          </div>
        </div>

        <CodeEditor value={code} onChange={setCode} language={language} />

        <div className="compiler-input">
          <label htmlFor="stdin" className="field-label">
            Input (stdin)
          </label>
          <textarea
            id="stdin"
            className="textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Optional input passed to your program when you Run"
            rows={3}
          />
        </div>
      </div>

      <div className="compiler-pane compiler-pane--right">
        <div className="tabs compiler-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="compiler-tab-content">
          {activeTab === 'Test Cases' && (
            <TestCasePanel testCases={problem?.examples ?? []} status={submitStatus === 'submitted' ? 'submitted' : 'idle'} />
          )}
          {activeTab === 'Console' && <OutputPanel status={runStatus} result={runResult} />}
          {activeTab === 'Result' && <SubmissionStatus status={submitStatus} result={submitResult} />}
        </div>
      </div>
    </div>
  );
}
