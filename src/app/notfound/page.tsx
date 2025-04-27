'use client';

import { useRouter } from 'next/navigation';
import styles from './not-found.module.css'; // for basic centering

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => router.push('/')}
          className={styles.button}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
