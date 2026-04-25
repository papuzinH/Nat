import React from 'react';

interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  errorMsg?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  type,
  label,
  value,
  placeholder,
  required = false,
  disabled = false,
  errorMsg,
  onChange,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft mb-2"
    >
      {label}{required && ' *'}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className={[
        'w-full bg-transparent border-0 border-b px-0 py-2',
        'font-body text-ink placeholder:text-ink-soft/40 text-base',
        'focus:outline-none transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        errorMsg ? 'border-[#a8503f]' : 'border-[var(--line)] focus:border-sage-700',
      ].join(' ')}
    />
    {errorMsg && (
      <p className="mt-1 text-[#a8503f] text-xs font-body">{errorMsg}</p>
    )}
  </div>
);

export default InputField;
