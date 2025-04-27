import React, { Dispatch, SetStateAction } from 'react';

interface TextAreaProps {
  value: string;
  setStateChange: Dispatch<SetStateAction<string>>;
  placeholder: string;
  disabled?: boolean;
}
export default function TextArea(props: TextAreaProps) {
  const { value, setStateChange, placeholder, disabled = false } = props;
  return (
    <textarea
      className="textarea textarea-bordered w-full mt-2"
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={e => setStateChange(e.target.value)}
    />
  );
}

// export default TextArea;
