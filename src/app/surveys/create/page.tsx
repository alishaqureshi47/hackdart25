"use client"

import { useState } from "react"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default function SurveyPage() {
  const { data: session, status } = useSession();
  
  // local state for each field
  const [topic, setTopic] = useState("")
  const [objective, setObjective] = useState("")
  const [questions, setQuestions] = useState("")

  if (status === "unauthenticated") {
    redirect("/login");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // send data to backend
    
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Create a survey.</h1>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.field}>
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            name="topic"
            type="text"
            placeholder="e.g. Customer Satisfaction"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="objective">Objective</label>
          <input
            id="objective"
            name="objective"
            type="text"
            placeholder="e.g. Measure support response time"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="questions">Specific Questions</label>
          <input
            id="questions"
            name="questions"
            type="text"
            placeholder="e.g. How satisfied are you?"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </main>
  )
}