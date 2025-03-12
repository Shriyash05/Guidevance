"use client";

import { toast as sonnerToast } from "sonner"; // ✅ Directly use Sonner's toast

export function useToast() {
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss, // ✅ Sonner has a built-in dismiss function
  };
}
