import React from 'react';

interface InputProps {
  type?: string;
  disabled?: boolean;
  setStateChange: (value: string) => void;
  placeholder?: string;
  value?: string;
  className?: string;
}

export default function Input(props: InputProps) {
  const { type = 'text', disabled = false, placeholder = '', value, setStateChange, className = '' } = props;
  return (
    <div>
      <input
        className={`input input-bordered w-full mt-2 ${className}`}
        type={type}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={e => setStateChange(e.target.value)}
      />
    </div>
  );
}
