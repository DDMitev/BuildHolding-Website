/**
 * Project Storage Service
 * 
 * Provides local browser storage for project data to allow changes to persist
 * between page refreshes while in development.
 * 
 * In a production environment, this would be replaced with actual API calls.
 */

import hardcodedProjects from '../data/hardcoded-projects';

const STORAGE_KEY = 'buildholding-projects-data';

/**
 * Initialize the storage with either the saved data or hardcoded data
 * @returns {Array} Array of project objects
 */
export const initializeProjects = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    // If no saved data, use the hardcoded projects as a fallback
    return [...hardcodedProjects];
  } catch (error) {
    console.error('Error initializing projects:', error);
    return [...hardcodedProjects];
  }
};

/**
 * Save projects data to localStorage
 * @param {Array} projects - Array of project objects to save
 * @returns {boolean} Success status
 */
export const saveProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    // Add a timestamp to force a refresh when hardcoded projects are next accessed
    localStorage.setItem('buildholding-last-update', Date.now().toString());
    console.log('Projects saved to localStorage', projects);
    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
};

/**
 * Clear saved project data and revert to hardcoded defaults
 * @returns {Array} The default hardcoded projects
 */
export const resetToDefaults = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('buildholding-last-update');
    return [...hardcodedProjects];
  } catch (error) {
    console.error('Error resetting projects:', error);
    return [...hardcodedProjects];
  }
};

/**
 * Get a single project by ID
 * @param {string} id - Project ID
 * @returns {Object|null} Project object or null if not found
 */
export const getProjectById = (id) => {
  try {
    const projects = initializeProjects();
    return projects.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting project:', error);
    return null;
  }
};

/**
 * Update a single project
 * @param {string} id - Project ID to update
 * @param {Object} updatedProject - New project data
 * @returns {boolean} Success status
 */
export const updateProject = (id, updatedProject) => {
  try {
    const projects = initializeProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }
    
    projects[index] = updatedProject;
    saveProjects(projects);
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
};

// Override the original hardcoded-projects.js export
export const getProjects = () => {
  return initializeProjects();
};

export default {
  initializeProjects,
  saveProjects,
  resetToDefaults,
  getProjectById,
  updateProject,
  getProjects
};
