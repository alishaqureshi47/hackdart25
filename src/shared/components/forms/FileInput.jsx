import React, { useState } from 'react';
import styles from './FileInput.module.css';

export const FileInput = ({ id, label, accept, onChange, reference }) => {
  const [fileName, setFileName] = useState('No file chosen');
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
    
    if (onChange) {
      onChange(e);
    }
  };
  
  const handleButtonClick = () => {
    // Trigger the hidden file input click
    if (reference && reference.current) {
      reference.current.click();
    }
  };
  
  return (
    <div className={styles.uploadField}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.customFileInput}>
        {/* Hidden actual file input */}
        <input
          ref={reference}
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />
        
        {/* Custom styled file input */}
        <div className={styles.fileInputContainer}>
          <button
            type="button"
            onClick={handleButtonClick}
            className={styles.uploadButton}
          >
            Choose File
          </button>
          <div className={styles.fileName}>{fileName}</div>
        </div>
      </div>
    </div>
  );
};

export default FileInput;