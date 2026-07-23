import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthLayout() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Pane - Illustration */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 bg-primary/5 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-lg text-center animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-lg">
              E
            </div>
            <span className="font-display font-bold text-3xl tracking-tight text-foreground">Empathezee</span>
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-4 text-foreground/90 leading-tight">
            Your path to mindful wellness starts here.
          </h1>
          <p className="text-lg text-secondary-foreground/70">
            Join thousands of others in finding balance, connecting with professionals, and cultivating a healthier mind.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative z-20">
        <div className="w-full max-w-md bg-card border shadow-2xl shadow-primary/5 rounded-[2.5rem] p-8 md:p-12">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
