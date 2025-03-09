"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ForwardRefEditor } from "./ForwardRefEditor";
import { type MDXEditorMethods } from "@mdxeditor/editor";

interface EditorProps {
  initialContent?: string;
  onChange?: (markdown: string) => void;
  onSave?: (markdown: string) => void;
  className?: string;
  autoSaveDelay?: number; // Time in ms to wait before autosaving
}

export const Editor = ({
  initialContent = "",
  onChange,
  onSave,
  className = "",
  autoSaveDelay = 1500, // Default to 1.5 seconds
}: EditorProps) => {
  const [markdown, setMarkdown] = useState(initialContent);
  const [lastSavedContent, setLastSavedContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveContent = useCallback(() => {
    if (!onSave || markdown === lastSavedContent) return;

    setIsSaving(true);

    // In a real app, you might want to handle async save operations
    void Promise.resolve()
      .then(() => {
        onSave(markdown);
        setLastSavedContent(markdown);
      })
      .finally(() => {
        // Show saving indicator for at least 500ms for better UX
        setTimeout(() => setIsSaving(false), 500);
      });
  }, [onSave, markdown, lastSavedContent]);

  const handleChange = useCallback(
    (content: string) => {
      setMarkdown(content);
      onChange?.(content);

      // Reset the timer on each change
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set a new timer for autosave
      if (onSave) {
        autoSaveTimerRef.current = setTimeout(() => {
          saveContent();
        }, autoSaveDelay);
      }
    },
    [onChange, onSave, autoSaveDelay, saveContent],
  );

  const handleManualSave = useCallback(() => {
    // Clear any pending autosave
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    saveContent();
  }, [saveContent]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Save on Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleManualSave();
      }
    },
    [handleManualSave],
  );

  // Clean up the timer when unmounting
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`editor-container ${className}`} onKeyDown={handleKeyDown}>
      <ForwardRefEditor
        ref={editorRef}
        markdown={markdown}
        onChange={handleChange}
        className="h-full w-full border-none outline-none focus:outline-none"
      />

      {onSave && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {isSaving && (
            <span className="text-sm text-slate-500">Saving...</span>
          )}
          <button
            onClick={handleManualSave}
            className="rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};
