import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { sessionManager } from "@/utils/sessionManager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SessionTimeoutDialog = () => {
  const { sessionTimeoutWarning, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (sessionTimeoutWarning) {
      setOpen(true);

      // Get remaining time and update countdown
      const remaining = sessionManager.getRemainingSessionTime();
      setRemainingTime(Math.floor(remaining / 1000));

      // Update countdown every second
      const countdownInterval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else {
      setOpen(false);
    }
  }, [sessionTimeoutWarning]);

  const handleContinue = () => {
    // This will trigger user activity and reset the session timeout
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in {formatTime(remainingTime)} due to
            inactivity. Would you like to continue your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>Logout</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            Continue Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionTimeoutDialog;
