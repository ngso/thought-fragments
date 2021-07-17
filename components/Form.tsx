import React from 'react';

interface Props {
  title?: string;
  onSubmit?: (e: any) => void;
  buttonText?: string;
}

const Form: React.FC<Props> = ({ children, buttonText, title, onSubmit }) => {
  return (
    <div className="flex justify-center items-center h-screen px-2">
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-center p-2 sm:p-4 w-full md:w-3/5 lg:w-3/6 xl:w-2/6 bg-white border border-gray-300 rounded-md"
      >
        <h2 className="font-bold text-2xl mb-8">{title}</h2>
        {children}
        <button
          type="submit"
          className="bg-blue-600 text-gray-50 rounded-md py-2 w-3/5"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default Form;
