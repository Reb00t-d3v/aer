import { useState } from "react";
import { X } from "lucide-react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { Button } from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  initialView = "login" 
}: AuthModalProps) {
  const [view, setView] = useState<"login" | "signup">(initialView);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 z-10 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {view === "login" ? "Sign in to your account" : "Create your account"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        {view === "login" ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSuccess={onClose} />
        )}
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            {view === "login" ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              onClick={() => setView(view === "login" ? "signup" : "login")}
              className="text-primary hover:text-primary-dark dark:hover:text-primary-light font-medium px-2 py-0"
            >
              {view === "login" ? "Sign up" : "Sign in"}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
