import React from 'react';

interface TextareaFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  id,
  name,
  label,
  value,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  onChange
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-white font-body mb-2 text-sm font-medium text-left">
        {label} {required && '*'}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
        className="text-gray-600 w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent font-body transition-all duration-200 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default TextareaField;
