"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h2>Experience the craft of survey creation</h2>
        <p className={styles.lead}>
          Easily design your survey in a matter of minutes. Access your audience on all platforms. Observe results visually and in real-time.
        </p>
        <button className={styles.primaryButton}>Request a Demo</button>
      </section>

      <section className={styles.features}>
        <h3>You can create a survey quick and easy process</h3>
        <p>Create a survey in just minutes and analyze responses in seconds with ease.</p>
      </section>

      <section className={styles.ratings}>
        <span className={styles.stars}>★★★★★</span>
        <span className={styles.trustpilot}>Trustpilot</span>
      </section>
    </main>
  )
}