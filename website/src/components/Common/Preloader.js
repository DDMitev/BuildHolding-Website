import React from 'react';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="logo-center">BH</div>
      </div>
    </div>
  );
};

export default Preloader;
