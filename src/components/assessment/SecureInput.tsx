import { useRef, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

/**
 * SecureInput — anti-paste textarea for assessments.
 * - Blocks paste (Ctrl+V, context menu)
 * - Blocks drag-and-drop text
 * - Submit on Enter (Shift+Enter for newline)
 */
const SecureInput = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Type your answer…',
  maxLength = 10000,
}: SecureInputProps) => {
  const { toast } = useToast();
  const ref = useRef<HTMLTextAreaElement>(null);

  const blockPaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      toast({
        title: 'Paste disabled',
        description: 'Please type your answer manually during the assessment.',
        variant: 'destructive',
      });
    },
    [toast]
  );

  const blockDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      toast({
        title: 'Drag & drop disabled',
        description: 'Please type your answer manually during the assessment.',
        variant: 'destructive',
      });
    },
    [toast]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Submit on Enter (but allow Shift+Enter for newlines)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim()) onSubmit();
      }
    },
    [value, onSubmit]
  );

  return (
    <div className="relative">
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        onPaste={blockPaste}
        onDrop={blockDrop}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
        className="resize-none pr-20 text-base"
        autoComplete="off"
        spellCheck={false}
      />
      <span className="absolute bottom-2 right-3 text-xs text-gray-400 select-none">
        {value.length.toLocaleString()} / {maxLength.toLocaleString()}
      </span>
    </div>
  );
};

export default SecureInput;
