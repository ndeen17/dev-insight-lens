import { useState, useCallback, useRef } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { ChevronDown, RotateCcw, Settings, Copy, Check } from 'lucide-react';
import type { LanguageInfo } from '@/types/assessment';

interface CodeEditorProps {
  /** Current source code */
  value: string;
  /** Called when code changes */
  onChange: (value: string) => void;
  /** Currently selected language */
  language: LanguageInfo;
  /** Available languages to pick from */
  languages: LanguageInfo[];
  /** Called when user switches language */
  onLanguageChange: (lang: LanguageInfo) => void;
  /** Starter / reset code for current language */
  starterCode?: string;
  /** Whether editor is read-only (e.g. reviewing past submissions) */
  readOnly?: boolean;
  /** Height of the editor (default: 100%) */
  height?: string;
  /** Show the language selector toolbar */
  showToolbar?: boolean;
  /** Dark mode */
  theme?: 'vs-dark' | 'light';
}

export default function CodeEditor({
  value,
  onChange,
  language,
  languages,
  onLanguageChange,
  starterCode = '',
  readOnly = false,
  height = '100%',
  showToolbar = true,
  theme = 'vs-dark',
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange: OnChange = useCallback(
    (val) => {
      onChange(val || '');
    },
    [onChange]
  );

  const handleReset = () => {
    onChange(starterCode);
    editorRef.current?.focus();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const cycleFontSize = () => {
    setFontSize((prev) => {
      if (prev >= 20) return 12;
      return prev + 2;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-700">
      {/* ─── Toolbar ──────────────────────────────────────── */}
      {showToolbar && (
        <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-gray-700">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-200 bg-[#333333] hover:bg-[#3c3c3c] rounded-md transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              {language.name}
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1 z-20 w-52 bg-[#252526] border border-gray-600 rounded-lg shadow-xl py-1 max-h-60 overflow-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.key}
                      onClick={() => {
                        onLanguageChange(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        lang.key === language.key
                          ? 'bg-lime-400/10 text-lime-400'
                          : 'text-gray-300 hover:bg-[#333333]'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={cycleFontSize}
              title={`Font size: ${fontSize}px`}
              className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#333333] rounded transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              title="Copy code"
              className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#333333] rounded transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-lime-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            {starterCode && !readOnly && (
              <button
                onClick={handleReset}
                title="Reset to starter code"
                className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-[#333333] rounded transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Monaco Editor ────────────────────────────────── */}
      <div className="flex-1 min-h-0">
        <Editor
          height={height}
          language={language.monacoId}
          value={value}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          theme={theme}
          options={{
            fontSize,
            fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Menlo, Monaco, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            bracketPairColorization: { enabled: true },
            readOnly,
            domReadOnly: readOnly,
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                Loading editor...
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
