import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/Common/HeroSection';
import * as contactContentService from '../services/contactContentService';

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState(null);
  
  // Load content from contactContentService
  useEffect(() => {
    const content = contactContentService.getContactContent();
    setPageContent(content);
  }, []);
  
  // Social media links from content service or fallback to defaults
  const socialLinks = Array.isArray(pageContent?.socialLinks) ? pageContent.socialLinks : [
    { icon: 'fab fa-facebook-f', url: '#', name: 'Facebook' },
    { icon: 'fab fa-linkedin-in', url: '#', name: 'LinkedIn' },
    { icon: 'fab fa-instagram', url: '#', name: 'Instagram' },
    { icon: 'fab fa-twitter', url: '#', name: 'Twitter' }
  ];
  
  // Contact info items from content service or fallback to defaults
  const contactInfo = Array.isArray(pageContent?.contactInfo) ? pageContent.contactInfo : [
    { 
      icon: 'fas fa-map-marker-alt', 
      title: t('contact.location.title'), 
      content: t('contact.location.address'),
      color: '#0056b3'
    },
    { 
      icon: 'fas fa-phone-alt', 
      title: t('contact.contactUs'), 
      content: [t('contact.location.phone'), t('contact.location.email')],
      color: '#ff7722'
    },
    { 
      icon: 'fas fa-clock', 
      title: t('contact.openingHours'), 
      content: t('contact.location.hours'),
      color: '#28a745'
    }
  ];
  
  // Validate form
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!data.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!data.message.trim()) {
      errors.message = 'Message is required';
    } else if (data.message.length < 10) {
      errors.message = 'Message too short';
    }
    
    return errors;
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched
    setFormTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  
  // Handle input blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setFormTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  
  // Update errors when form data changes
  useEffect(() => {
    if (Object.keys(formTouched).length > 0) {
      setFormErrors(validateForm(formData));
    }
  }, [formData, formTouched]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = validateForm(formData);
    setFormErrors(errors);
    
    // Mark all fields as touched
    const touchedFields = {};
    Object.keys(formData).forEach(key => {
      touchedFields[key] = true;
    });
    setFormTouched(touchedFields);
    
    // If no errors, submit form
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form submission:', formData);
        setFormSubmitted(true);
        setIsLoading(false);
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setFormSubmitted(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
          setFormTouched({});
        }, 5000);
      }, 1500);
    }
  };
  
  return (
    <div className="contact-page">
      <HeroSection 
        title={pageContent?.hero?.title?.[t('language')] || pageContent?.hero?.title?.en || t('contact.title')} 
        subtitle={pageContent?.hero?.subtitle?.[t('language')] || pageContent?.hero?.subtitle?.en || t('contact.subtitle')}
        backgroundImage={pageContent?.hero?.backgroundImage || "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format"}
        height="60vh"
        overlayOpacity={0.7}
      />
      
      {/* Contact Info Cards Section */}
      <section className="contact-info-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title position-relative d-inline-block" style={{color: '#212529 !important'}}>
                <span className="bg-white px-3">
                  {pageContent?.contactSection?.title?.[t('language')] || pageContent?.contactSection?.title?.en || t('contact.contactUs')}
                </span>
                <span className="title-line"></span>
              </h2>
              <p className="lead text-muted max-width-800 mx-auto" style={{color: '#6c757d !important'}}>
                {pageContent?.contactSection?.subtitle?.[t('language')] || pageContent?.contactSection?.subtitle?.en || t('contact.subtitle')}
              </p>
            </div>
          </div>
          
          <div className="row justify-content-center">
            {contactInfo.map((item, index) => (
              <div className="col-md-6 col-lg-4 mb-4" key={index}>
                <div className="contact-card card h-100 border-0 shadow hover-lift">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="contact-icon-wrapper flex-shrink-0 me-3"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <i 
                          className={item.icon} 
                          style={{ color: item.color }}
                        ></i>
                      </div>
                      <h4 className="card-title h5 mb-0">{item.title}</h4>
                    </div>
                    
                    {Array.isArray(item.content) ? (
                      <ul className="list-unstyled mb-0">
                        {item.content.map((line, i) => (
                          <li key={i} className="text-muted mb-2">
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted mb-0">{item.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Form and Map Section */}
      <section className="form-map-section bg-light py-5">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            {/* Contact Form */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="contact-form-wrapper bg-white shadow h-100 p-4 p-lg-5 rounded-4">
                <h3 className="h4 mb-4 border-start border-primary ps-3 py-1">
                  {pageContent?.form?.title?.[t('language')] || pageContent?.form?.title?.en || t('contact.form.title')}
                </h3>
                
                {formSubmitted ? (
                  <div className="form-success p-4 text-center">
                    <div 
                      className="success-icon mb-4"
                      style={{ 
                        backgroundColor: '#28a74520',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}
                    >
                      <i 
                        className="fas fa-check" 
                        style={{ 
                          color: '#28a745', 
                          fontSize: '2.5rem' 
                        }}
                      ></i>
                    </div>
                    <h3 className="h4 mb-3">{t('contact.form.success')}</h3>
                    <p className="text-muted mb-0">{t('contact.form.successMessage')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label htmlFor="name" className="form-label">
                            {pageContent?.form?.fields?.name?.label?.[t('language')] || pageContent?.form?.fields?.name?.label?.en || t('contact.form.name')} <span className="text-danger">*</span>
                          </label>
                          <input 
                            type="text" 
                            className={`form-control ${formTouched.name && formErrors.name ? 'is-invalid' : ''}`}
                            id="name" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                          />
                          {formTouched.name && formErrors.name && (
                            <div className="invalid-feedback">{formErrors.name}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label htmlFor="email" className="form-label">
                            {pageContent?.form?.fields?.email?.label?.[t('language')] || pageContent?.form?.fields?.email?.label?.en || t('contact.form.email')} <span className="text-danger">*</span>
                          </label>
                          <input 
                            type="email" 
                            className={`form-control ${formTouched.email && formErrors.email ? 'is-invalid' : ''}`}
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                          />
                          {formTouched.email && formErrors.email && (
                            <div className="invalid-feedback">{formErrors.email}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label htmlFor="phone" className="form-label">
                            {pageContent?.form?.fields?.phone?.label?.[t('language')] || pageContent?.form?.fields?.phone?.label?.en || t('contact.form.phone')}
                          </label>
                          <input 
                            type="tel" 
                            className="form-control"
                            id="phone" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <div className="form-group">
                          <label htmlFor="subject" className="form-label">
                            {pageContent?.form?.fields?.subject?.label?.[t('language')] || pageContent?.form?.fields?.subject?.label?.en || t('contact.form.subject')} <span className="text-danger">*</span>
                          </label>
                          <input 
                            type="text" 
                            className={`form-control ${formTouched.subject && formErrors.subject ? 'is-invalid' : ''}`}
                            id="subject" 
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                          />
                          {formTouched.subject && formErrors.subject && (
                            <div className="invalid-feedback">{formErrors.subject}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="form-group">
                        <label htmlFor="message" className="form-label">
                          {pageContent?.form?.fields?.message?.label?.[t('language')] || pageContent?.form?.fields?.message?.label?.en || t('contact.form.message')} <span className="text-danger">*</span>
                        </label>
                        <textarea 
                          className={`form-control ${formTouched.message && formErrors.message ? 'is-invalid' : ''}`}
                          id="message" 
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        ></textarea>
                        {formTouched.message && formErrors.message && (
                          <div className="invalid-feedback">{formErrors.message}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-text text-muted">
                        <small><span className="text-danger">*</span> Required fields</small>
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg px-4 d-flex align-items-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span 
                              className="spinner-border spinner-border-sm me-2" 
                              role="status" 
                              aria-hidden="true"
                            ></span>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            {pageContent?.form?.submit?.label?.[t('language')] || pageContent?.form?.submit?.label?.en || t('contact.form.send')}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            {/* Map Section */}
            <div className="col-lg-6">
              <div className="map-social-container h-100 d-flex flex-column">
                <div className="map-container shadow rounded-4 overflow-hidden flex-grow-1 mb-4">
                  <div className="map-responsive h-100">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187673.30869540413!2d23.1864849!3d42.6954322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa8682cb317bf5%3A0x400a01269bf5e60!2sSofia%2C%20Bulgaria!5e0!3m2!1sen!2sus!4v1651179402619!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="BuildHolding Location"
                    ></iframe>
                  </div>
                </div>
                
                {/* Social Media Section */}
                <div className="social-container bg-white shadow rounded-4 p-4 text-center">
                  <h4 className="h5 mb-3">{pageContent?.socialSection?.title?.[t('language')] || pageContent?.socialSection?.title?.en || t('contact.followUs')}</h4>
                  <div className="social-links d-flex justify-content-center">
                    {socialLinks.map((social, index) => (
                      <a 
                        key={index} 
                        href={social.url} 
                        className="social-link"
                        title={social.name}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <i className={social.icon}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary">
        <div className="container">
          <div className="row justify-content-center text-center text-white">
            <div className="col-lg-8">
              <h3>{pageContent?.cta?.title?.[t('language')] || pageContent?.cta?.title?.en || t('home.cta.title')}</h3>
              <p className="mb-4">{pageContent?.cta?.subtitle?.[t('language')] || pageContent?.cta?.subtitle?.en || t('home.cta.subtitle')}</p>
              <a href="tel:+35921234567" className="btn btn-light btn-lg px-4">
                <i className="fas fa-phone-alt me-2"></i>
                {pageContent?.cta?.button?.label?.[t('language')] || pageContent?.cta?.button?.label?.en || t('contact.location.phone')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
