import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthForm from "./auth/AuthForm";
import { useAuth } from "../contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Home = () => {
  const { isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Handle login
  const handleLogin = async (data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    try {
      const { email, password, rememberMe } = data;
      const auth = useAuth();
      await auth.login(email, password, rememberMe);
    } catch (err) {
      // Error is handled by the auth context
      console.error("Login error:", err);
    }
  };

  // Handle registration
  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const { name, email, password } = data;
      const auth = useAuth();
      await auth.register(name, email, password);
    } catch (err) {
      // Error is handled by the auth context
      console.error("Registration error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            className={`${error.includes("successful") ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"} shadow-lg`}
            onClick={clearError}
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;
