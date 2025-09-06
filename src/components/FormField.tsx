import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  field: {
    name: string;
    label: string;
    type: 'text' | 'date' | 'textarea' | 'select';
    required: boolean;
    placeholder?: string;
    options?: string[];
  };
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

export default function FormField({ field, value, onChange, error }: FormFieldProps) {
  const { name, label, type, required, placeholder, options } = field;

  const inputClasses = `w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
    error
      ? 'border-red-500 bg-red-50 focus:ring-red-200'
      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
  } focus:outline-none focus:ring-2`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            rows={4}
            className={inputClasses}
          />
        );
      
      case 'select':
        return (
          <select
            id={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className={inputClasses}
          >
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={type}
            id={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}