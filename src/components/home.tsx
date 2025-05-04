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
      await useAuth().login(email, password, rememberMe);
    } catch (err) {
      // Error is handled by the auth context
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
      await useAuth().register(name, email, password);
    } catch (err) {
      // Error is handled by the auth context
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                className={`mb-4 ${error.includes("successful") ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}`}
                onClick={clearError}
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <AuthForm
              onLogin={handleLogin}
              onRegister={handleRegister}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
