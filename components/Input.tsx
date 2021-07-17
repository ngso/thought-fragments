import React from 'react';

interface Props {
  type: string;
  id: string;
  value: string;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
}

const Input: React.FC<Props> = ({ label, id, ...rest }) => {
  return (
    <div className="flex flex-col mb-8 w-full">
      {label ? (
        <label className="mb-2" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input
        className="outline-none text-md border border-gray-300 focus:border-blue-700 rounded-md p-2"
        id={id}
        {...rest}
      />
    </div>
  );
};

export default Input;
