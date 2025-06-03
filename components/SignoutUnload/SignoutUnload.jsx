"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust path to your client file

export default function SignoutUnload() {
  const signOutTimeoutRef = useRef(null);
  const isSigningOutRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    const REMEMBER_ME_KEY = "supabase_remember_me";

    // Function to check if "Remember me" is checked
    const isRememberMeChecked = () => {
      const rememberCheckbox = document.getElementById("remember");
      return rememberCheckbox ? rememberCheckbox.checked : false;
    };

    // Function to get remember me preference from localStorage
    const getRememberMeFromStorage = () => {
      try {
        return localStorage.getItem(REMEMBER_ME_KEY) === "true";
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return false;
      }
    };

    // Function to save remember me preference to localStorage
    const saveRememberMeToStorage = (value) => {
      try {
        localStorage.setItem(REMEMBER_ME_KEY, value.toString());
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    };

    // Function to check if user should be remembered (checkbox OR localStorage)
    const shouldRememberUser = () => {
      return isRememberMeChecked() || getRememberMeFromStorage();
    };

    // Initialize checkbox state from localStorage
    const initializeCheckboxState = () => {
      const rememberCheckbox = document.getElementById("remember");
      const storedValue = getRememberMeFromStorage();

      if (rememberCheckbox && storedValue) {
        rememberCheckbox.checked = true;
      }
    };

    // Function to handle sign out
    const handleSignOut = async () => {
      // Check if user should be remembered - if yes, don't sign out
      if (shouldRememberUser()) {
        console.log("Remember me is active - skipping auto sign-out");
        return;
      }

      // Prevent multiple simultaneous sign-out attempts
      if (isSigningOutRef.current) return;

      isSigningOutRef.current = true;

      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Error during auto sign-out:", error);
        } else {
          console.log("User signed out automatically");
          // Clear remember me preference after sign out
          saveRememberMeToStorage(false);
        }
      } catch (error) {
        console.error("Error during auto sign-out:", error);
      } finally {
        isSigningOutRef.current = false;
      }
    };

    // Immediate sign out for tab/window closing
    const handleBeforeUnload = (event) => {
      // Check remember me before proceeding
      if (shouldRememberUser()) {
        return; // Don't sign out if remember me is active
      }

      // Clear any pending timeouts
      if (signOutTimeoutRef.current) {
        clearTimeout(signOutTimeoutRef.current);
      }

      // Immediate sign out
      handleSignOut();
    };

    // Handle page hide (more reliable than beforeunload in mobile browsers)
    const handlePageHide = (event) => {
      // Check remember me before proceeding
      if (shouldRememberUser()) {
        return; // Don't sign out if remember me is active
      }

      handleSignOut();
    };

    // Handle visibility changes with a delay
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Only set timeout if remember me is not active
        if (!shouldRememberUser()) {
          // Set a timeout to sign out after a delay when tab becomes hidden
          signOutTimeoutRef.current = setTimeout(() => {
            if (document.hidden && !shouldRememberUser()) {
              handleSignOut();
            }
          }, 60000); // 1 minute delay - adjust as needed
        }
      } else {
        // Tab became visible again, cancel the sign out
        if (signOutTimeoutRef.current) {
          clearTimeout(signOutTimeoutRef.current);
          signOutTimeoutRef.current = null;
        }
      }
    };

    // Handle focus events
    const handleWindowFocus = () => {
      // Window gained focus - cancel any pending sign outs
      if (signOutTimeoutRef.current) {
        clearTimeout(signOutTimeoutRef.current);
        signOutTimeoutRef.current = null;
      }
    };

    // Handle remember me checkbox changes
    const handleRememberMeChange = (event) => {
      const isChecked = event.target.checked;
      console.log("Remember me changed:", isChecked);

      // Save to localStorage
      saveRememberMeToStorage(isChecked);

      // If remember me was just unchecked and tab is hidden, start sign-out process
      if (!isChecked && document.hidden) {
        signOutTimeoutRef.current = setTimeout(() => {
          if (document.hidden && !shouldRememberUser()) {
            handleSignOut();
          }
        }, 60000);
      }

      // If remember me was just checked, cancel any pending sign-out
      if (isChecked && signOutTimeoutRef.current) {
        clearTimeout(signOutTimeoutRef.current);
        signOutTimeoutRef.current = null;
      }
    };

    // Initialize checkbox state when component mounts
    const setupCheckbox = () => {
      setTimeout(() => {
        initializeCheckboxState();

        // Add event listener to checkbox
        const rememberCheckbox = document.getElementById("remember");
        if (rememberCheckbox) {
          rememberCheckbox.addEventListener("change", handleRememberMeChange);
        }
      }, 100); // Small delay to ensure DOM is ready
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    // Setup checkbox
    setupCheckbox();

    // Cleanup function
    return () => {
      // Clear any pending timeouts
      if (signOutTimeoutRef.current) {
        clearTimeout(signOutTimeoutRef.current);
      }

      // Remove event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);

      // Remove checkbox listener
      const rememberCheckbox = document.getElementById("remember");
      if (rememberCheckbox) {
        rememberCheckbox.removeEventListener("change", handleRememberMeChange);
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
}
