/**
 * Firebase Authentication Service
 * 
 * Provides Firebase authentication services for user login/logout
 * and access control for admin features.
 */

import { 
  getAuth,
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

// Get the auth instance
const auth = getAuth();

/**
 * Sign in a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object or error
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, error: error.message };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<boolean>} Success status
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};

/**
 * Create a new user account
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @param {string} role - User role (admin, editor, viewer)
 * @returns {Promise<Object>} User object or error
 */
export const createUser = async (email, password, displayName, role = 'viewer') => {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore with role
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName,
      role,
      createdAt: serverTimestamp()
    });
    
    return { user, error: null };
  } catch (error) {
    console.error('Error creating user:', error);
    return { user: null, error: error.message };
  }
};

/**
 * Get the current user's role from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<string>} User role or null if not found
 */
export const getUserRole = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().role;
    } else {
      console.log('No user document found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<boolean>} Success status
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent');
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Check if a user has admin privileges
 * @param {string} uid - User ID
 * @returns {Promise<boolean>} Whether the user is an admin
 */
export const isAdmin = async (uid) => {
  if (!uid) return false;
  
  try {
    const role = await getUserRole(uid);
    return role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Get the current authenticated user
 * @returns {Object|null} Current user or null if not signed in
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

export default {
  signIn,
  signOutUser,
  createUser,
  getUserRole,
  resetPassword,
  subscribeToAuthChanges,
  isAdmin,
  getCurrentUser
};
