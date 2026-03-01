import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase/firebase-config';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import hanapLogo from '../assets/logo.png';

const Login = () => {
  // State to toggle between Login and Register modes
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle Email & Password Submission
  const handleEmailAuth = async (e) => {
    e.preventDefault(); // Prevents page reload
    setError(''); // Clear old errors
    
    try {
      if (isRegistering) {
        // Register a new user
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Log in an existing user
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Clean up Firebase error messages to be user-friendly
      if (err.code === 'auth/email-already-in-use') setError('This email is already registered.');
      else if (err.code === 'auth/wrong-password') setError('Incorrect password.');
      else if (err.code === 'auth/user-not-found') setError('No account found with this email.');
      else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters.');
      else setError('Failed to authenticate. Please try again.');
    }
  };

  // Handle Google Login
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
    <div style={styles.page}>
      <div style={styles.card}>

        <img 
          src={hanapLogo} 
          alt="Hanap Logo" 
          style={{ width: '150px', height: '150px', objectFit: 'contain', marginBottom: '10px', borderRadius: '12px' }} 
        />

        <p style={{ color: '#64748B', marginBottom: '25px', fontSize: '0.9rem' }}>
          {isRegistering ? 'Create a new account' : 'Sign in to your account'}
        </p>

        {/* Show Errors if they exist */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input 
            type="password" 
            placeholder="Password (min 6 chars)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.primaryButton}>
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.dividerContainer}>
          <div style={styles.line}></div>
          <span style={styles.orText}>OR</span>
          <div style={styles.line}></div>
        </div>
        
        {/* Google Button */}
        <button onClick={handleGoogleLogin} style={styles.googleButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Toggle Mode Text */}
        <p style={{ marginTop: '25px', fontSize: '0.85rem', color: '#64748B' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(''); // Clear errors when switching modes
            }} 
            style={styles.toggleLink}
          >
            {isRegistering ? 'Sign In' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
};

// Styles mapped to your Sky Blue theme
const styles = {
  page: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg)' },
  card: { background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.15)', width: '100%', maxWidth: '380px' },
  input: { width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' },
  primaryButton: { width: '100%', padding: '12px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' },
  googleButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '12px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 'bold', color: '#334155', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  dividerContainer: { display: 'flex', alignItems: 'center', margin: '20px 0' },
  line: { flex: 1, height: '1px', backgroundColor: '#E2E8F0' },
  orText: { margin: '0 15px', color: '#94A3B8', fontSize: '0.85rem', fontWeight: 'bold' },
  toggleLink: { color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' },
  errorBox: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', border: '1px solid #FCA5A5' }
};

export default Login;