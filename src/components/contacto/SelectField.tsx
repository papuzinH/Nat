import React from 'react';

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
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
      <label htmlFor={id} className="block text-white font-body mb-2 text-sm font-medium text-left">
        {label} {required && '*'}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="text-gray-600 w-full px-4 py-3 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-400 focus:border-transparent font-body transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
