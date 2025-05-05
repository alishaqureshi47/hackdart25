import Image from "next/image"
import styles from "./page.module.css"

type Person = {
  name: string
  imgSrc: string
  imgAlt: string
  bio: string
}

const TEAM: Person[] = [
  {
    name: " Alisha Ahmad Qureshi",
    imgSrc: "/AlishaAboutMe.jpeg",
    imgAlt: "Alisha Headshot",
    bio: "Front-end programmer",
  },
  {
    name: "Alejandro S. Manrique",
    imgSrc: "/AlejandroAboutMe.png",
    imgAlt: "Alejandro HeadShot",
    bio: "Full-stack programmer",
  },
  {
    name: "Tina Pan",
    imgSrc: "/TinaAboutMe.png",
    imgAlt: "Tina HeadShot",
    bio: "Front-end programmer",
  },
  {
    name: "Vishal J. Powell",
    imgSrc: "/VishalAboutMe.jpg",
    imgAlt: "Vishal HeadShot",
    bio: "Front-end programmer",
  },
]

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <h1>Meet the Team</h1>
      <div className={styles.teamGrid}>
        {TEAM.map((person) => (
          <div key={person.name} className={styles.member}>
            <div className={styles.avatar}>
              <Image
                src={person.imgSrc}
                alt={person.imgAlt}
                fill
                sizes="(max-width: 600px) 120px, 150px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.info}>
              <h3>{person.name}</h3>
              <p>{person.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}