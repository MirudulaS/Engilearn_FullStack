import { languages } from '../../data/languages';

export default function LanguageSelector({ value, onChange }) {
  return (
    <select
      className="select language-selector"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option value={lang.id} key={lang.id}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
