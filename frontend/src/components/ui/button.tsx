import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition ${className || ""}`}
    >
      {children}
    </button>
  );
}
