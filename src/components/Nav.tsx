"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./Nav.module.css"
import { usePathname } from "next/navigation"

export type NavProps = {
  avatarSrc?: string            // path to the image you want in top‐right
}

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about",     label: "About" },
]

export default function Nav({ avatarSrc }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  function handleNavClick(e: any) {
    setMenuOpen(false);
    const pathname = usePathname();

    // If we're clicking a link to the current page, reload the page
    if (e.currentTarget.getAttribute("href") === pathname) {
      e.preventDefault()
      window.location.href = pathname
    }
  }

  return (
    <header className={styles.navbar}>
      {/* Brand / logo on the left */}
      <Link href="/" className={styles.brand} onClick={handleNavClick}>
        <img src="/logo.png" alt="Logo" width={36} />
        <span className={styles.brandName}>quipp</span>
      </Link>

      {/* Desktop & Mobile nav links */}
      <nav
        className={
          menuOpen
            ? `${styles.navLinks} ${styles.navLinksOpen}`
            : styles.navLinks
        }
      >
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={handleNavClick}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Avatar in top‐right (optional) */}
      {avatarSrc && (
        <div className={styles.avatarWrapper}>
          <Image
            src="/menubar.png"
            alt="User avatar"
            width={32}
            height={32}
            className={styles.avatar}
          />
        </div>
      )}

      {/* Burger toggle */}
      <button
        className={styles.burger}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <Image 
          src="/menubar.png"
          alt=""
          width={24}
          height={24}
        />
      </button>
    </header>
  )
}