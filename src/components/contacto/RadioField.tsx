import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioFieldProps {
  name: string;
  label: string;
  value: string;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioField: React.FC<RadioFieldProps> = ({
  name,
  label,
  value,
  options,
  required = false,
  disabled = false,
  onChange
}) => {
  return (
    <div>
      <label className="block text-white font-body mb-3 text-sm font-medium text-left">
        {label} {required && '*'}
      </label>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
              disabled={disabled}
              className="w-4 h-4 text-green-600 border-cream-300 focus:ring-2 focus:ring-green-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="ml-3 text-white font-body text-sm">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioField;
