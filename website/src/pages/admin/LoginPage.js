import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/api.service';
import LanguageSelector from '../../components/LanguageSelector';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.data) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          email: response.data.email,
          displayName: response.data.displayName,
          role: response.data.role
        }));
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-login-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow mt-5" style={{ backgroundColor: '#ffffff' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">{t('admin.login.title')}</h2>
                  <p className="text-muted">{t('admin.login.subtitle')}</p>
                </div>
                
                {/* Language Selector */}
                <div className="mb-3 text-center">
                  <div className="d-inline-block">
                    <LanguageSelector vertical={false} />
                  </div>
                </div>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-dark">
                      {t('admin.login.email')}
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: '#ffffff', color: '#333333' }}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label text-dark">
                      {t('admin.login.password')}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      style={{ backgroundColor: '#ffffff', color: '#333333' }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="ms-2">{t('admin.login.signingIn')}</span>
                      </div>
                    ) : (
                      t('admin.login.signIn')
                    )}
                  </button>
                </form>

                {/* Display default credentials hint */}
                <div className="mt-3 text-center">
                  <small className="text-muted">
                    Default: admin@buildholding.com / admin123
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
