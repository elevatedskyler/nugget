"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface TextEditorProps {
  value: string;
  setValue: (text: string) => void;
  onChange?: (text: string) => void;
  onSave?: (text: string) => void;
  nuggetId?: string;
  className?: string;
  autoSaveDelay?: number; // Time in ms to wait before autosaving
  onClose: () => void;
}

export const Editor = ({
  value,
  setValue,
  onChange,
  onSave,
  onClose,
  className = "",
  autoSaveDelay = 1500, // Default to 1.5 seconds
}: TextEditorProps) => {
  const [lastSavedContent, setLastSavedContent] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveContent = useCallback(() => {
    if (!onSave || value === lastSavedContent) return;

    setIsSaving(true);

    // In a real app, you might want to handle async save operations
    void Promise.resolve()
      .then(() => {
        onSave(value);
        setLastSavedContent(value);
      })
      .finally(() => {
        // Show saving indicator for at least 500ms for better UX
        setTimeout(() => setIsSaving(false), 500);
      });
  }, [onSave, value, lastSavedContent]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const content = e.target.value;
      setValue(content);
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
    [onChange, onSave, autoSaveDelay, saveContent, setValue],
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

  // Auto-focus the textarea when the component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <button
        className="absolute right-0 top-0 z-10 rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
        onClick={onClose}
      >
        Close
      </button>
      <div
        className={`editor-container relative ${className}`}
        onKeyDown={handleKeyDown}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          className="h-full w-full resize-none border-none p-4 text-2xl outline-none focus:outline-none"
          placeholder="Start typing here..."
        />

        {isSaving && <span className="text-sm text-slate-500">Saving...</span>}
      </div>
    </div>
  );
};
