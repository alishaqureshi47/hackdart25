"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./Nav.module.css"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/about",     label: "About" },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  // close menu when a link is clicked
  function handleNavClick() {
    setMenuOpen(false)
  }

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.brand} onClick={handleNavClick}>
        <img src="/logo.png" alt="Logo" width={30} height={30} />
        <span className={styles.brandName}>Quipp</span>
      </Link>

      <nav
        className={
          menuOpen
            ? `${styles.navLinks} ${styles.open}`
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

      <button
        className={styles.burger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <Image
          src={ menuOpen ? "/close.svg" : "/menu.svg" }
          alt=""
          width={24}
          height={24}
        />
      </button>
    </header>
  )
}