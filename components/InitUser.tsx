"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function InitUser() {
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to initialize user');
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        toast.error('Failed to initialize user data');
      }
    };

    initializeUser();
  }, []);

  return null;
} 