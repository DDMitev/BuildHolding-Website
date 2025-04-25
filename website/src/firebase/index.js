/**
 * Firebase Services Index
 * 
 * This file exports all Firebase services for easier imports elsewhere in the app
 */

// Firebase configuration
export { db, auth } from './config';

// Auth Service
export { default as authService } from './authService';

// Content Services
export { default as projectService } from './projectService';
export { default as contactContentService } from './contactContentService';
export { default as homeContentService } from './homeContentService';
export { default as holdingContentService } from './holdingContentService';

// Direct export of common functionality from all services for convenience
export { 
  // Projects
  getProjects, 
  getProjectById, 
  addProject, 
  updateProject,
  deleteProject,
  getProjectsByCategory,
  resetToDefaults as resetProjectsToDefaults
} from './projectService';

export {
  // Auth
  signIn,
  signOutUser,
  createUser,
  getUserRole,
  resetPassword,
  subscribeToAuthChanges,
  isAdmin,
  getCurrentUser
} from './authService';
