import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase/firebase-config';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import hanapLogo from '../assets/logo.png';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err.code === 'auth/email-already-in-use') setError('This email is already registered.');
      else if (err.code === 'auth/wrong-password') setError('Incorrect password.');
      else if (err.code === 'auth/user-not-found') setError('No account found with this email.');
      else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters.');
      else setError('Failed to authenticate. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google login error:", err);
      setError('Google sign-in was canceled or failed.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-body)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '2.5rem' }}>

        <img 
          src={hanapLogo} 
          alt="Hanap Logo" 
          style={{ width: '140px', height: '140px', objectFit: 'contain', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }} 
        />
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
          {isRegistering ? 'Create a new account' : 'Sign in to your account'}
        </p>

        {/* Error Notification */}
        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', border: '1px solid #fecaca', fontWeight: 500 }}>
            {error}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="At least 6 characters" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}>
            {isRegistering ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
          <span style={{ margin: '0 1rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
        </div>
        
        {/* Google Button */}
        <button onClick={handleGoogleLogin} className="btn btn-cancel" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#ffffff', color: 'var(--text-main)', padding: '0.75rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Toggle Mode Text */}
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }} 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
          >
            {isRegistering ? 'Sign In' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;