import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Feather, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email); // Upgraded to allow any email for live databases
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const hasUpper = /[A-Z]/;
    const hasLower = /[a-z]/;
    const hasNumber = /[0-9]/;
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    // We only enforce strict checks on Sign-UP. On login, just send whatever they type to Firebase to speed verification.
    if (!isLogin) {
      if (!minLength.test(password)) return "Password must be at least 8 characters long.";
      if (!hasUpper.test(password)) return "Password must contain at least one uppercase letter (A-Z).";
      if (!hasLower.test(password)) return "Password must contain at least one lowercase letter (a-z).";
      if (!hasNumber.test(password)) return "Password must contain at least one number (0-9).";
      if (!hasSymbol.test(password)) return "Password must contain at least one special symbol (!@#$ etc.).";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-flight Validations
    if (!validateEmail(email)) {
      setError('Email must be valid.');
      return;
    }

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Ping Firebase to sign in
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Ping Firebase to sign up
        await createUserWithEmailAndPassword(auth, email, password);
      }
      
      // Firebase triggers onAuthStateChanged in App.jsx which will auto-redirect them immediately.
      // But we can manually call navigate just to be safe.
      navigate('/app');
      
    } catch (err) {
      // Meaningful Error Handling based on Firebase Error Codes
      console.error(err.code);
      if (err.code === 'auth/email-already-in-use') {
         setError('This email is already registered! Please switch to Sign In.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
         setError('Account not found or password incorrect.');
      } else if (err.code === 'auth/too-many-requests') {
         setError('Too many failed attempts. Try again later.');
      } else {
         setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -m-16 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 -m-16 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-60"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/30">
              <Feather className="text-white w-7 h-7" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 text-center mb-2 tracking-tight">
            {isLogin ? 'Welcome back to Jot AI' : 'Create your workspace'}
          </h2>
          <p className="text-slate-500 text-sm text-center font-medium mb-8">
            {isLogin ? 'Sign in to jump back into your documents.' : 'Sign up to unlock advanced AI writing tools.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                   <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[12px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                {isLogin && <a href="#" className="text-[12px] font-bold text-teal-600 hover:text-teal-700">Forgot?</a>}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[13px] font-semibold py-3 px-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-[15px] transition-all shadow-[0_4px_20px_-5px_rgba(15,23,42,0.3)] flex justify-center items-center gap-2 mt-4 disabled:opacity-75"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-8 text-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <span className="text-[13px] font-medium text-slate-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
               type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-[13px] cursor-pointer font-bold text-teal-600 hover:text-teal-700 transition-colors"
            >
              {isLogin ? 'Sign up for free' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
