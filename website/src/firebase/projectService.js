/**
 * Firebase Project Service
 * 
 * Provides Firestore database storage for project data.
 * This replaces the local storage implementation with a proper backend solution.
 */

import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import hardcodedProjects from '../data/hardcoded-projects';

const PROJECTS_COLLECTION = 'projects';

/**
 * Initialize projects in Firestore if they don't exist
 * @returns {Promise<boolean>} Success status
 */
export const initializeFirestoreProjects = async () => {
  try {
    // Check if projects collection has any documents
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    
    // If no projects exist, populate with hardcoded data
    if (querySnapshot.empty) {
      // Use Promise.all to wait for all operations to complete
      await Promise.all(hardcodedProjects.map(async (project) => {
        const docRef = doc(db, PROJECTS_COLLECTION, project.id);
        await setDoc(docRef, {
          ...project,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }));
      console.log('Projects initialized in Firestore');
      return true;
    }
    return true;
  } catch (error) {
    console.error('Error initializing Firestore projects:', error);
    return false;
  }
};

/**
 * Get all projects from Firestore
 * @returns {Promise<Array>} Array of project objects
 */
export const getProjects = async () => {
  try {
    // Initialize projects if they don't exist
    await initializeFirestoreProjects();
    
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    const projects = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    return projects;
  } catch (error) {
    console.error('Error getting projects from Firestore:', error);
    // Fallback to hardcoded projects in case of error
    return [...hardcodedProjects];
  }
};

/**
 * Get a single project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object|null>} Project object or null if not found
 */
export const getProjectById = async (id) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such project exists');
      return null;
    }
  } catch (error) {
    console.error('Error getting project from Firestore:', error);
    return null;
  }
};

/**
 * Add a new project to Firestore
 * @param {Object} project - Project data without ID
 * @returns {Promise<string|null>} New project ID or null if failed
 */
export const addProject = async (project) => {
  try {
    // Create a new document reference with auto-generated ID
    const newDocRef = doc(collection(db, PROJECTS_COLLECTION));
    
    // Add the document with the auto-generated ID
    await setDoc(newDocRef, {
      ...project,
      id: newDocRef.id, // Store the ID in the document too
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Project added with ID:', newDocRef.id);
    return newDocRef.id;
  } catch (error) {
    console.error('Error adding project to Firestore:', error);
    return null;
  }
};

/**
 * Update a single project
 * @param {string} id - Project ID to update
 * @param {Object} updatedProject - New project data
 * @returns {Promise<boolean>} Success status
 */
export const updateProject = async (id, updatedProject) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    
    // Make sure we have the most recent version
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.log('No such project exists');
      return false;
    }
    
    // Update the document
    await updateDoc(docRef, {
      ...updatedProject,
      updatedAt: serverTimestamp()
    });
    
    console.log('Project updated:', id);
    return true;
  } catch (error) {
    console.error('Error updating project in Firestore:', error);
    return false;
  }
};

/**
 * Delete a project
 * @param {string} id - Project ID to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteProject = async (id) => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await deleteDoc(docRef);
    
    console.log('Project deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting project from Firestore:', error);
    return false;
  }
};

/**
 * Get projects by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} Array of matching project objects
 */
export const getProjectsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    const projects = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    return projects;
  } catch (error) {
    console.error('Error getting projects by category:', error);
    return [];
  }
};

/**
 * Reset to hardcoded defaults
 * @returns {Promise<boolean>} Success status
 */
export const resetToDefaults = async () => {
  try {
    // First delete all existing projects
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    
    await Promise.all(querySnapshot.docs.map(async (document) => {
      await deleteDoc(doc(db, PROJECTS_COLLECTION, document.id));
    }));
    
    // Then re-initialize with hardcoded data
    await initializeFirestoreProjects();
    
    console.log('Projects reset to defaults');
    return true;
  } catch (error) {
    console.error('Error resetting projects to defaults:', error);
    return false;
  }
};

export default {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
  getProjectsByCategory,
  resetToDefaults,
  initializeFirestoreProjects
};
