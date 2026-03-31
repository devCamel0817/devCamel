import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: Props) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-surface-400">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-4 py-3 rounded-xl bg-surface-800 border border-glass-border text-white placeholder-surface-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${
          error ? 'border-danger' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
