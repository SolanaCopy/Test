// src/components/ui/input.tsx
import React, { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="border p-2 rounded w-full" />;
}
