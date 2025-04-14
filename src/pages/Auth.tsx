import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'register' | 'reset';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'login') {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          toast.error('Login failed', { description: loginError.message });
          return;
        }
        toast.success('Logged in successfully');
        navigate('/dashboard');
      } else if (mode === 'register') {
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
        setMode('login');
      } else if (mode === 'reset') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
        
        if (resetError) {
          toast.error('Password reset failed', { description: resetError.message });
          return;
        }
        
        toast.success('Password reset email sent', {
          description: 'Check your email to reset your password'
        });
      }
    } catch (err) {
      console.error('Authentication error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Password'}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'register' && (
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName"
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={mode === 'register'}
                placeholder="Enter your full name"
              />
            </div>
          )}
          
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
          
          {mode !== 'reset' && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={mode !== 'reset'}
                placeholder="Enter your password"
              />
            </div>
          )}
          
          <Button type="submit" className="w-full">
            {mode === 'login' ? 'Log In' : mode === 'register' ? 'Register' : 'Reset Password'}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          {mode === 'login' && (
            <>
              <button 
                onClick={() => setMode('reset')} 
                className="text-blue-600 hover:underline mr-2"
              >
                Forgot password?
              </button>
              <button 
                onClick={() => setMode('register')} 
                className="text-blue-600 hover:underline"
              >
                Create an account
              </button>
            </>
          )}
          
          {mode === 'register' && (
            <button 
              onClick={() => setMode('login')} 
              className="text-blue-600 hover:underline"
            >
              Already have an account? Log in
            </button>
          )}
          
          {mode === 'reset' && (
            <button 
              onClick={() => setMode('login')} 
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
