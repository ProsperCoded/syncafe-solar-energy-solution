import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'register' | 'reset';

const Auth = () => {
  const [authMode, setAuthMode] = useState<"login" | "register" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        toast.error('Login failed', { description: loginError.message });
        return;
      }
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error: registerError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (registerError) {
        toast.error('Registration failed', { description: registerError.message });
        return;
      }
      
      toast.success('Registration successful', {
        description: 'Please check your email to verify your account'
      });
      setAuthMode('login');
    } catch (err) {
      console.error('Authentication error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (authMode === "login") {
      return (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
      );
    } else if (authMode === "register") {
      return (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName"
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={authMode === "register"}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      );
    } else {
      return (
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {authMode === 'login' ? 'Login' : authMode === 'register' ? 'Register' : 'Reset Password'}
        </h2>
        
        {renderForm()}
        
        <div className="mt-4 text-center text-sm">
          {authMode === 'login' && (
            <>
              <button 
                onClick={() => setAuthMode('reset')} 
                className="text-blue-600 hover:underline mr-2"
              >
                Forgot password?
              </button>
              <button 
                onClick={() => setAuthMode('register')} 
                className="text-blue-600 hover:underline"
              >
                Create an account
              </button>
            </>
          )}
          
          {authMode === 'register' && (
            <button 
              onClick={() => setAuthMode('login')} 
              className="text-blue-600 hover:underline"
            >
              Already have an account? Log in
            </button>
          )}
          
          {authMode === 'reset' && (
            <button 
              onClick={() => setAuthMode('login')} 
              className="text-blue-600 hover:underline"
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
