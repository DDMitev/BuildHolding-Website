import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Button, Alert } from 'react-bootstrap';
import projectService from '../../firebase/projectService';
import { useFirebase } from '../../firebase/FirebaseContext';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useFirebase();
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize projects
  useEffect(() => {
    // Load projects
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Use Firebase projectService instead of localStorage
        const allProjects = await projectService.getProjects();
        
        if (allProjects && allProjects.length > 0) {
          // Take the most recent 5 projects
          setRecentProjects(allProjects.slice(0, 5));
          setError(null);
        } else {
          setRecentProjects([]);
          setError('No projects found. Add some projects to see them here.');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load recent projects. Please try again.');
        // Set empty array as fallback
        setRecentProjects([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Count projects by status
  const countProjectsByStatus = (status) => {
    if (!Array.isArray(recentProjects)) return 0;
    return recentProjects.filter(project => project.status === status).length;
  };
  
  const completedProjects = countProjectsByStatus('complete');
  const inProgressProjects = countProjectsByStatus('in-progress');
  const plannedProjects = countProjectsByStatus('planned');
  const totalProjects = recentProjects.length;
  
  if (!currentUser) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Dashboard Header */}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2 mb-0" style={{ color: '#212529 !important' }}>
          {t('admin.dashboard.welcomeTitle')}
        </h1>
      </div>
      
      {/* Project Statistics */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <Card className="h-100 shadow-sm" style={{ backgroundColor: '#ffffff !important', color: '#333333 !important', border: '1px solid #dee2e6' }}>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-3">
              <div className="display-4 mb-2 text-primary" style={{ color: '#0056b3 !important' }}>
                {totalProjects}
              </div>
              <div className="mb-0 text-muted" style={{ color: '#6c757d !important' }}>
                {t('admin.dashboard.totalProjects')}
              </div>
              <div className="mt-3">
                <i className="fas fa-project-diagram fa-2x text-primary" style={{ color: '#0056b3 !important' }}></i>
              </div>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-md-3 mb-3">
          <Card className="h-100 shadow-sm" style={{ backgroundColor: '#ffffff !important', color: '#333333 !important', border: '1px solid #dee2e6' }}>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-3">
              <div className="display-4 mb-2 text-success" style={{ color: '#28a745 !important' }}>
                {completedProjects}
              </div>
              <div className="mb-0 text-muted" style={{ color: '#6c757d !important' }}>
                {t('admin.dashboard.completedProjects')}
              </div>
              <div className="mt-3">
                <i className="fas fa-check-circle fa-2x text-success" style={{ color: '#28a745 !important' }}></i>
              </div>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-md-3 mb-3">
          <Card className="h-100 shadow-sm" style={{ backgroundColor: '#ffffff !important', color: '#333333 !important', border: '1px solid #dee2e6' }}>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-3">
              <div className="display-4 mb-2 text-info" style={{ color: '#17a2b8 !important' }}>
                {inProgressProjects}
              </div>
              <div className="mb-0 text-muted" style={{ color: '#6c757d !important' }}>
                {t('admin.dashboard.inProgressProjects')}
              </div>
              <div className="mt-3">
                <i className="fas fa-spinner fa-2x text-info" style={{ color: '#17a2b8 !important' }}></i>
              </div>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-md-3 mb-3">
          <Card className="h-100 shadow-sm" style={{ backgroundColor: '#ffffff !important', color: '#333333 !important', border: '1px solid #dee2e6' }}>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center p-3">
              <div className="display-4 mb-2 text-warning" style={{ color: '#ffc107 !important' }}>
                {plannedProjects}
              </div>
              <div className="mb-0 text-muted" style={{ color: '#6c757d !important' }}>
                {t('admin.dashboard.plannedProjects')}
              </div>
              <div className="mt-3">
                <i className="fas fa-calendar-alt fa-2x text-warning" style={{ color: '#ffc107 !important' }}></i>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      
      {/* Recent Projects */}
      <div className="row">
        <div className="col-12">
          <Card className="shadow-sm" style={{ backgroundColor: '#ffffff !important', color: '#333333 !important', border: '1px solid #dee2e6' }}>
            <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f8f9fa !important', color: '#333333 !important' }}>
              <h5 className="mb-0" style={{ color: '#333333 !important' }}>
                {t('admin.dashboard.recentProjects')}
              </h5>
              <Button 
                variant="primary" 
                size="sm"
                as={Link}
                to="/admin/projects"
                style={{ backgroundColor: '#0056b3 !important', color: '#ffffff !important' }}
              >
                <i className="fas fa-plus me-1"></i> {t('admin.projects.addNew')}
              </Button>
            </Card.Header>
            <Card.Body style={{ backgroundColor: '#ffffff !important', color: '#333333 !important' }}>
              {loading && (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              
              {error && !loading && (
                <Alert variant="info" className="mb-0" style={{ backgroundColor: '#cce5ff !important', color: '#004085 !important' }}>
                  <i className="fas fa-info-circle me-2"></i> {error}
                </Alert>
              )}
              
              {!loading && !error && recentProjects.length === 0 && (
                <div className="text-center py-4">
                  <p className="mb-3" style={{ color: '#6c757d !important' }}>No projects found.</p>
                  <Button 
                    variant="primary" 
                    as={Link}
                    to="/admin/projects"
                    style={{ backgroundColor: '#0056b3 !important', color: '#ffffff !important' }}
                  >
                    <i className="fas fa-plus me-1"></i> Add Your First Project
                  </Button>
                </div>
              )}
              
              {!loading && !error && recentProjects.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover" style={{ color: '#333333 !important' }}>
                    <thead>
                      <tr>
                        <th style={{ color: '#333333 !important' }}>Project Name</th>
                        <th style={{ color: '#333333 !important' }}>Status</th>
                        <th style={{ color: '#333333 !important' }}>Location</th>
                        <th style={{ color: '#333333 !important' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProjects.map((project, index) => (
                        <tr key={project.id || index}>
                          <td style={{ color: '#333333 !important' }}>
                            <strong>{project.title?.en || 'Untitled Project'}</strong>
                          </td>
                          <td style={{ color: '#333333 !important' }}>
                            <span className={`badge bg-${
                              project.status === 'complete' ? 'success' : 
                              project.status === 'in-progress' ? 'info' : 
                              'warning'
                            }`}>
                              {project.status === 'complete' ? 'Completed' : 
                               project.status === 'in-progress' ? 'In Progress' : 
                               'Planned'}
                            </span>
                          </td>
                          <td style={{ color: '#333333 !important' }}>{project.location?.en || 'N/A'}</td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              className="me-1"
                              as={Link}
                              to={`/admin/projects?id=${project.id || index}`}
                              style={{ backgroundColor: '#ffffff !important', color: '#0056b3 !important' }}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                              variant="outline-info" 
                              size="sm"
                              as={Link}
                              to={`/projects/${project.id || index}`}
                              target="_blank"
                              style={{ backgroundColor: '#ffffff !important', color: '#17a2b8 !important' }}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
