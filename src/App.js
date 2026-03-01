import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase-config';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // This listener automatically fires when a user logs in or logs out
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsCheckingAuth(false); // Done checking
    });

    // Cleanup the listener when the app closes
    return () => unsubscribe();
  }, []);

  // Show a blank screen or a loading spinner while Firebase checks the login status
  if (isCheckingAuth) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  // If no user is found, show the Login page. Otherwise, show the Dashboard.
  return (
    <>
      {!currentUser ? <Login /> : <Home />}
    </>
  );
}

export default App;