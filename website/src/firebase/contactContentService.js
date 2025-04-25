/**
 * Firebase Contact Content Service
 * 
 * Provides Firestore database storage for contact page content.
 * This replaces the local storage implementation with a proper backend solution.
 */

import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  query,
  limit
} from 'firebase/firestore';
import { db } from './config';

const CONTENT_COLLECTION = 'contactContent';
const DEFAULT_DOC_ID = 'default';

/**
 * Initialize default contact content if it doesn't exist
 * @param {Object} defaultContent - Default content to initialize
 * @returns {Promise<boolean>} Success status
 */
export const initializeContactContent = async (defaultContent) => {
  try {
    // Check if content already exists
    const docRef = doc(db, CONTENT_COLLECTION, DEFAULT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    // If no content exists, create it with default data
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        ...defaultContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Contact content initialized in Firestore');
    }
    return true;
  } catch (error) {
    console.error('Error initializing contact content:', error);
    return false;
  }
};

/**
 * Get the current contact content
 * @returns {Promise<Object>} Contact content object
 */
export const getContactContent = async () => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, DEFAULT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No contact content found, initializing default');
      // Return empty object, proper initialization should happen at app startup
      return {};
    }
  } catch (error) {
    console.error('Error getting contact content:', error);
    return {};
  }
};

/**
 * Update contact content
 * @param {Object} updatedContent - New content data
 * @returns {Promise<boolean>} Success status
 */
export const updateContactContent = async (updatedContent) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, DEFAULT_DOC_ID);
    
    // First check if document exists
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(docRef, {
        ...updatedContent,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new document
      await setDoc(docRef, {
        ...updatedContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Contact content updated');
    return true;
  } catch (error) {
    console.error('Error updating contact content:', error);
    return false;
  }
};

/**
 * Save a contact form submission
 * @param {Object} contactForm - Form submission data
 * @returns {Promise<string|null>} ID of the new submission or null if failed
 */
export const saveContactSubmission = async (contactForm) => {
  try {
    // Create a new document with auto-generated ID
    const newDocRef = doc(collection(db, 'contactSubmissions'));
    
    // Add the document with timestamp
    await setDoc(newDocRef, {
      ...contactForm,
      status: 'new',
      createdAt: serverTimestamp()
    });
    
    console.log('Contact submission saved with ID:', newDocRef.id);
    return newDocRef.id;
  } catch (error) {
    console.error('Error saving contact submission:', error);
    return null;
  }
};

/**
 * Get all contact form submissions
 * @param {number} limit - Maximum number of submissions to retrieve
 * @returns {Promise<Array>} Array of contact form submissions
 */
export const getContactSubmissions = async (limitCount = 100) => {
  try {
    const q = query(
      collection(db, 'contactSubmissions'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const submissions = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...doc.data() });
    });
    
    return submissions;
  } catch (error) {
    console.error('Error getting contact submissions:', error);
    return [];
  }
};

export default {
  initializeContactContent,
  getContactContent,
  updateContactContent,
  saveContactSubmission,
  getContactSubmissions
};
