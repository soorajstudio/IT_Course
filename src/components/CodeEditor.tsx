import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { sql } from '@codemirror/lang-sql';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { php } from '@codemirror/lang-php';
import { oneDark } from '@codemirror/theme-one-dark';
import { useApp } from '../context/AppContext';

interface CodeEditorProps {
  value: string;
  onChange: (nextValue: string) => void;
  language: 'javascript' | 'python' | 'java' | 'cpp' | 'sql' | 'html' | 'css' | 'php';
  minHeight?: string;
}

function getLanguageExtension(lang: CodeEditorProps['language']) {
  switch (lang) {
    case 'javascript':
      return javascript({ jsx: true, typescript: true });
    case 'python':
      return python();
    case 'java':
      return java();
    case 'cpp':
      return cpp();
    case 'sql':
      return sql();
    case 'html':
      return html();
    case 'css':
      return css();
    case 'php':
      return php();
    default:
      return javascript();
  }
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  minHeight = '320px',
}) => {
  const { theme } = useApp();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!hostRef.current) return;

    const baseTheme = EditorView.theme({
      '&': {
        fontSize: '13.5px',
        fontFamily: 'var(--font-mono)',
        minHeight,
        backgroundColor: theme === 'dark' ? '#0D1424' : '#FFFFFF',
      },
      '.cm-scroller': {
        overflow: 'auto',
        fontFamily: 'var(--font-mono)',
      },
      '.cm-content': {
        padding: '12px 0',
      },
      '.cm-gutters': {
        backgroundColor: theme === 'dark' ? '#0F172A' : '#F8FAFC',
        borderRight: theme === 'dark' ? '1px solid #1E293B' : '1px solid #E2E8F0',
        color: theme === 'dark' ? '#64748B' : '#94A3B8',
      },
    });

    const extensions = [
      basicSetup,
      lineNumbers(),
      keymap.of([...defaultKeymap, indentWithTab]),
      getLanguageExtension(language),
      baseTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
    ];

    if (theme === 'dark') {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: hostRef.current,
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Recreate editor when language or theme switches cleanly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, theme, minHeight]);

  // Sync external value changes (e.g., switching problem or resetting code)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
      data-testid="code-editor"
    >
      <div ref={hostRef} aria-label={`${language} code editor`} />
    </div>
  );
};
