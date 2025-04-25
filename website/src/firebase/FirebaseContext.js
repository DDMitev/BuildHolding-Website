/**
 * Firebase Context Provider
 * 
 * Provides Firebase authentication state and services throughout the application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToAuthChanges, getUserRole, isAdmin } from './authService';
import { initializeFirestoreProjects } from './projectService';

// Create context
const FirebaseContext = createContext(null);

// Hook for using the Firebase context
export const useFirebase = () => useContext(FirebaseContext);

// Provider component
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setLoading(true);
      
      if (user) {
        // User is signed in
        setUser(user);
        
        // Get user role
        const role = await getUserRole(user.uid);
        setUserRole(role);
        
        // Check if user is admin
        const adminStatus = await isAdmin(user.uid);
        setIsUserAdmin(adminStatus);
      } else {
        // User is signed out
        setUser(null);
        setUserRole(null);
        setIsUserAdmin(false);
      }
      
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Initialize Firestore data
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        
        // Initialize projects
        await initializeFirestoreProjects();
        
        // TODO: Initialize other content if needed
        // This could include initializing home content, contact content, etc.
        
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing Firebase data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
  }, []);

  // Context value
  const value = {
    user,
    userRole,
    isAdmin: isUserAdmin,
    loading,
    initialized
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
