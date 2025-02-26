import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({ children, className, style }: CardProps) {
  return (
    <div style={style} className={`bg-white shadow-md rounded-lg p-6 ${className || ""}`}>
      {children}
    </div>
  );
}
