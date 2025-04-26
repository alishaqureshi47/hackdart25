"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

// nav items
const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <Link href="/" className={styles.brand}>
          <Image src="/logo.png" alt="Logo" width={32} height={32}/>
          <span className={styles.brandName}>Quipps</span>
        </Link>
        <nav className={styles.navLinks}>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <button className={styles.burger} aria-label="Open menu">
          <Image src="/menu.svg" alt="" width={24} height={24}/>
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h2>Experience the craft of survey creation</h2>
          <p className={styles.lead}>
            Easily design your survey in a matter of minutes. Access your audience
            on all platforms. Observe results visually and in real-time.
          </p>
          <button className={styles.primaryButton} onClick={() => {
            router.push("/login");
          }}>Join now</button>
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
    </div>
  )
}