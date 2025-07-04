import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { auth } from '../firebase/config';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error(error.message || 'Failed to login');
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out!');
    } catch (error) {
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      
      try {
        // First try popup with resolver
        await signInWithPopup(auth, provider, browserPopupRedirectResolver);
        toast.success('Successfully logged in with Google!');
      } catch (popupError) {
        // If popup is blocked, fall back to redirect
        if (popupError.code === 'auth/popup-blocked') {
          toast.loading('Redirecting to Google sign-in...', { duration: 2000 });
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Handle redirect result when user returns from Google sign-in
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          toast.success('Successfully logged in with Google!');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to complete Google sign-in');
      }
    };

    handleRedirectResult();

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    googleLogin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};