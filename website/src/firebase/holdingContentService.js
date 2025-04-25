/**
 * Firebase Holding Content Service
 * 
 * Provides Firestore database storage for holding/company content.
 * This replaces the local storage implementation with a proper backend solution.
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const CONTENT_COLLECTION = 'holdingContent';
const DEFAULT_DOC_ID = 'default';
const TEAM_COLLECTION = 'team';
const TIMELINE_COLLECTION = 'timeline';
const SERVICES_COLLECTION = 'services';

/**
 * Initialize default holding content if it doesn't exist
 * @param {Object} defaultContent - Default content to initialize
 * @returns {Promise<boolean>} Success status
 */
export const initializeHoldingContent = async (defaultContent) => {
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
      console.log('Holding content initialized in Firestore');
    }
    return true;
  } catch (error) {
    console.error('Error initializing holding content:', error);
    return false;
  }
};

/**
 * Get the current holding content
 * @returns {Promise<Object>} Holding content object
 */
export const getHoldingContent = async () => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, DEFAULT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No holding content found, initializing default');
      // Return empty object, proper initialization should happen at app startup
      return {};
    }
  } catch (error) {
    console.error('Error getting holding content:', error);
    return {};
  }
};

/**
 * Update holding content
 * @param {Object} updatedContent - New content data
 * @returns {Promise<boolean>} Success status
 */
export const updateHoldingContent = async (updatedContent) => {
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
    
    console.log('Holding content updated');
    return true;
  } catch (error) {
    console.error('Error updating holding content:', error);
    return false;
  }
};

/**
 * Update about section content
 * @param {Object} aboutContent - New about section data
 * @returns {Promise<boolean>} Success status
 */
export const updateAboutSection = async (aboutContent) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, DEFAULT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentContent = docSnap.data();
      
      await updateDoc(docRef, {
        aboutSection: {
          ...currentContent.aboutSection,
          ...aboutContent
        },
        updatedAt: serverTimestamp()
      });
    } else {
      // If no content exists yet, create a new document with just the about section
      await setDoc(docRef, {
        aboutSection: aboutContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('About section updated');
    return true;
  } catch (error) {
    console.error('Error updating about section:', error);
    return false;
  }
};

/**
 * Update mission and vision content
 * @param {Object} missionContent - New mission and vision data
 * @returns {Promise<boolean>} Success status
 */
export const updateMissionVision = async (missionContent) => {
  try {
    const docRef = doc(db, CONTENT_COLLECTION, DEFAULT_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentContent = docSnap.data();
      
      await updateDoc(docRef, {
        missionVision: {
          ...currentContent.missionVision,
          ...missionContent
        },
        updatedAt: serverTimestamp()
      });
    } else {
      // If no content exists yet, create a new document with just mission/vision
      await setDoc(docRef, {
        missionVision: missionContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Mission and vision updated');
    return true;
  } catch (error) {
    console.error('Error updating mission and vision:', error);
    return false;
  }
};

/**
 * Get team members
 * @returns {Promise<Array>} Array of team member objects
 */
export const getTeamMembers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, TEAM_COLLECTION));
    const team = [];
    
    querySnapshot.forEach((doc) => {
      team.push({ id: doc.id, ...doc.data() });
    });
    
    return team;
  } catch (error) {
    console.error('Error getting team members:', error);
    return [];
  }
};

/**
 * Add a team member
 * @param {Object} member - Team member data
 * @returns {Promise<string|null>} ID of the new team member or null if failed
 */
export const addTeamMember = async (member) => {
  try {
    const docRef = await addDoc(collection(db, TEAM_COLLECTION), {
      ...member,
      createdAt: serverTimestamp()
    });
    
    console.log('Team member added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding team member:', error);
    return null;
  }
};

/**
 * Update a team member
 * @param {string} id - Team member ID
 * @param {Object} updatedMember - Updated team member data
 * @returns {Promise<boolean>} Success status
 */
export const updateTeamMember = async (id, updatedMember) => {
  try {
    const docRef = doc(db, TEAM_COLLECTION, id);
    await updateDoc(docRef, {
      ...updatedMember,
      updatedAt: serverTimestamp()
    });
    
    console.log('Team member updated:', id);
    return true;
  } catch (error) {
    console.error('Error updating team member:', error);
    return false;
  }
};

/**
 * Delete a team member
 * @param {string} id - Team member ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteTeamMember = async (id) => {
  try {
    const docRef = doc(db, TEAM_COLLECTION, id);
    await deleteDoc(docRef);
    
    console.log('Team member deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting team member:', error);
    return false;
  }
};

/**
 * Get timeline events
 * @returns {Promise<Array>} Array of timeline event objects
 */
export const getTimelineEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, TIMELINE_COLLECTION));
    const events = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by year, ascending
    return events.sort((a, b) => a.year - b.year);
  } catch (error) {
    console.error('Error getting timeline events:', error);
    return [];
  }
};

/**
 * Add a timeline event
 * @param {Object} event - Timeline event data
 * @returns {Promise<string|null>} ID of the new event or null if failed
 */
export const addTimelineEvent = async (event) => {
  try {
    const docRef = await addDoc(collection(db, TIMELINE_COLLECTION), {
      ...event,
      createdAt: serverTimestamp()
    });
    
    console.log('Timeline event added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding timeline event:', error);
    return null;
  }
};

/**
 * Update a timeline event
 * @param {string} id - Event ID
 * @param {Object} updatedEvent - Updated event data
 * @returns {Promise<boolean>} Success status
 */
export const updateTimelineEvent = async (id, updatedEvent) => {
  try {
    const docRef = doc(db, TIMELINE_COLLECTION, id);
    await updateDoc(docRef, {
      ...updatedEvent,
      updatedAt: serverTimestamp()
    });
    
    console.log('Timeline event updated:', id);
    return true;
  } catch (error) {
    console.error('Error updating timeline event:', error);
    return false;
  }
};

/**
 * Delete a timeline event
 * @param {string} id - Event ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteTimelineEvent = async (id) => {
  try {
    const docRef = doc(db, TIMELINE_COLLECTION, id);
    await deleteDoc(docRef);
    
    console.log('Timeline event deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    return false;
  }
};

/**
 * Get service offerings
 * @returns {Promise<Array>} Array of service objects
 */
export const getServices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, SERVICES_COLLECTION));
    const services = [];
    
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });
    
    return services;
  } catch (error) {
    console.error('Error getting services:', error);
    return [];
  }
};

/**
 * Add a service
 * @param {Object} service - Service data
 * @returns {Promise<string|null>} ID of the new service or null if failed
 */
export const addService = async (service) => {
  try {
    const docRef = await addDoc(collection(db, SERVICES_COLLECTION), {
      ...service,
      createdAt: serverTimestamp()
    });
    
    console.log('Service added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding service:', error);
    return null;
  }
};

/**
 * Update a service
 * @param {string} id - Service ID
 * @param {Object} updatedService - Updated service data
 * @returns {Promise<boolean>} Success status
 */
export const updateService = async (id, updatedService) => {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updatedService,
      updatedAt: serverTimestamp()
    });
    
    console.log('Service updated:', id);
    return true;
  } catch (error) {
    console.error('Error updating service:', error);
    return false;
  }
};

/**
 * Delete a service
 * @param {string} id - Service ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteService = async (id) => {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, id);
    await deleteDoc(docRef);
    
    console.log('Service deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting service:', error);
    return false;
  }
};

export default {
  initializeHoldingContent,
  getHoldingContent,
  updateHoldingContent,
  updateAboutSection,
  updateMissionVision,
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTimelineEvents,
  addTimelineEvent,
  updateTimelineEvent,
  deleteTimelineEvent,
  getServices,
  addService,
  updateService,
  deleteService
};
