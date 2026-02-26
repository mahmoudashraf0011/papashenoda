import React from 'react';

const CustomModal = ({ isVisible, children }) => {
  if (!isVisible) return null;

  return (
    <div className="custom-menu6">
      

        <div className="custom-modal-body">
          {children}
        </div>
    
    </div>
  );
};

export default CustomModal;
