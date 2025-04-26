import React from 'react';
import './SkeletonLoader.css'; // Add styles here or inline

const SkeletonLoader = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton skeleton-rect"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  );
};

export default SkeletonLoader;