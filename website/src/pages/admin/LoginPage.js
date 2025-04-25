import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signIn } from '../../firebase/authService';
import { useFirebase } from '../../firebase/FirebaseContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useFirebase();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [navigate, user]);
  
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
      const { user, error } = await signIn(credentials.email, credentials.password);
      
      if (user) {
        // Successful login will be handled by the Firebase context
        // which will trigger the useEffect above and redirect
        navigate('/admin/dashboard');
      } else if (error) {
        setError(error);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.message || 
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
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('admin.login.signingIn')}
                      </>
                    ) : (
                      t('admin.login.signIn')
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
