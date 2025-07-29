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
  onChange
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-white font-body mb-2 text-sm font-medium text-left">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="text-gray-600 w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent font-body transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
