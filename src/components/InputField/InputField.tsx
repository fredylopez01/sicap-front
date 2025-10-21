import React from "react";
import "./InputField.css";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options?: Array<{ value: string; label: string }>;
}

export function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  options,
}: InputFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {type === "select" && options ? (
        <select id={id} value={value} onChange={onChange} required>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          autoComplete={id}
        />
      )}
    </div>
  );
}
