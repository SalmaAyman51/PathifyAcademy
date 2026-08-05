import React from 'react';
import logoImg from '../../images/logo3.png'; 

const Logo = ({ width = "100px", height = "100px", className = "" }) => {
  return (
    <img 
      src={logoImg} 
      alt="Pathify Logo" 
      style={{ width: width, height: height }}
      className={`object-contain ${className}`}
    />
  );
};

export default Logo;