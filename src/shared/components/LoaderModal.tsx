"use client";

import React from 'react';
import styles from './LoaderModal.module.css';

// props def
interface LoadingModalProps {
  isLoading: boolean;
}

export default function LoadingModal({ isLoading }: LoadingModalProps) {
  return (
    <div className={`${styles.modalOverlay} ${isLoading ? styles.visible : ''}`}>
      <div className={styles.modalContent}>
        <div className="loader"></div>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    </div>
  );
}