/**
 * Firebase Home Content Service
 * 
 * Provides Firestore database storage for home page content.
 * This replaces the local storage implementation with a proper backend solution.
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const CONTENT_COLLECTION = 'homeContent';
const DEFAULT_DOC_ID = 'default';

/**
 * Initialize default home content if it doesn't exist
 * @param {Object} defaultContent - Default content to initialize
 * @returns {Promise<boolean>} Success status
 */
export const initializeHomeContent = async (defaultContent) => {
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
      console.log('Home content initialized in Firestore');
    }
    return true;
  } catch (error) {
    console.error('Error initializing home content:', error);
    return false;
  }
};

/**
 * Get the current home content
 * @returns {Promise<Object>} Home content object
 */
export const getHomeContent = async () => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, DEFAULT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No home content found, initializing default');
      // Return empty object, proper initialization should happen at app startup
      return {};
    }
  } catch (error) {
    console.error('Error getting home content:', error);
    return {};
  }
};

/**
 * Update home content
 * @param {Object} updatedContent - New content data
 * @returns {Promise<boolean>} Success status
 */
export const updateHomeContent = async (updatedContent) => {
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
    
    console.log('Home content updated');
    return true;
  } catch (error) {
    console.error('Error updating home content:', error);
    return false;
  }
};

/**
 * Update hero section content
 * @param {Object} heroContent - New hero section data
 * @returns {Promise<boolean>} Success status
 */
export const updateHeroSection = async (heroContent) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, DEFAULT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentContent = docSnap.data();
      
      await updateDoc(docRef, {
        heroSection: {
          ...currentContent.heroSection,
          ...heroContent
        },
        updatedAt: serverTimestamp()
      });
    } else {
      // If no content exists yet, create a new document with just the hero section
      await setDoc(docRef, {
        heroSection: heroContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Hero section updated');
    return true;
  } catch (error) {
    console.error('Error updating hero section:', error);
    return false;
  }
};

/**
 * Update testimonials section content
 * @param {Array} testimonials - New testimonials array
 * @returns {Promise<boolean>} Success status
 */
export const updateTestimonials = async (testimonials) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, DEFAULT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentContent = docSnap.data();
      
      await updateDoc(docRef, {
        testimonials: testimonials,
        updatedAt: serverTimestamp()
      });
    } else {
      // If no content exists yet, create a new document with just testimonials
      await setDoc(docRef, {
        testimonials: testimonials,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Testimonials updated');
    return true;
  } catch (error) {
    console.error('Error updating testimonials:', error);
    return false;
  }
};

export default {
  initializeHomeContent,
  getHomeContent,
  updateHomeContent,
  updateHeroSection,
  updateTestimonials
};
