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
    bio: "Passionate full-stack programmer crafting dynamic React and Node.js applications, optimizing databases, automating CI/CD pipelines, collaborating with teams to deliver high-performance software.",
  },
  {
    name: "Alejandro S. Manriqu",
    imgSrc: "/AlejandroAboutMe.png",
    imgAlt: "Alejandro HeadShot",
    bio: "Dedicated full-stack programmer designing intuitive Vue.js interfaces, building Django REST APIs, deploying robust infrastructure on AWS, maintainability, and performance optimization.",
  },
  {
    name: "Tina Pan",
    imgSrc: "/TinaAboutMe.png",
    imgAlt: "Tina HeadShot",
    bio: "Enthusiastic full-stack programmer combining Angular frontends with Express servers, managing PostgreSQL and MongoDB, containerizing with Docker, and orchestrating Jenkins for seamless deployments.",
  },
  {
    name: "Vishal J. Powell",
    imgSrc: "/VishalAboutMe.jpg",
    imgAlt: "Vishal HeadShot",
    bio: "Creative full-stack programmer leveraging Svelte and Spring Boot, integrating GraphQL APIs, automating Kubernetes deployments, practicing TDD, performance tuning, and exceeding user expectations.",
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