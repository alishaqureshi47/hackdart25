"use client"
import Image from "next/image"
import Link from "next/link"
import styles from "./Nav.module.css"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/about", label: "About" },
]

export default function Nav() {
  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        <img src="/logo.png" alt="Logo" width={30} />
        <span className={styles.brandName}>Quipp</span>
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
        <Image src="/menu.svg" alt="" width={24} height={24} />
      </button>
    </header>
  )
}