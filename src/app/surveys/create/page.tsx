// app/survey/create/page.tsx
"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import styles from "./page.module.css"

export default function SurveyPage() {
  const { data: session, status } = useSession()
  if (status === "unauthenticated") {
    redirect("/login")
  }

  const [topic, setTopic] = useState("")
  const [objective, setObjective] = useState("")
  
  // 1) Start with an empty array (no fields shown)
  const [questions, setQuestions] = useState<string[]>([])

  const addQuestion = () => setQuestions((qs) => [...qs, ""])
  const removeQuestion = (idx: number) =>
    setQuestions((qs) => qs.filter((_, i) => i !== idx))
  const updateQuestion = (idx: number, val: string) =>
    setQuestions((qs) => qs.map((q, i) => (i === idx ? val : q)))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ topic, objective, questions })
    // TODO: call your API…
    alert("Survey created!\n" + JSON.stringify({ topic, objective, questions }, null, 2))
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Create a survey</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Topic */}
        <div className={styles.field}>
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            type="text"
            placeholder="e.g. Customer Satisfaction"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>

        {/* Objective */}
        <div className={styles.field}>
          <label htmlFor="objective">Objective</label>
          <input
            id="objective"
            type="text"
            placeholder="e.g. Measure support response time"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            required
          />
        </div>

        {/* Dynamic Questions */}
        <div className={styles.field}>
          <label>Specific Questions</label>

          {questions.map((q, idx) => (
            <div key={idx} className={styles.questionField}>
              <input
                type="text"
                placeholder={`Question ${idx + 1}`}
                value={q}
                onChange={(e) => updateQuestion(idx, e.target.value)}
                // 2) removed `required` here
              />
              {questions.length > 0 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeQuestion(idx)}
                  aria-label={`Remove question ${idx + 1}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className={styles.addBtn}
            onClick={addQuestion}
          >
            + Add Question
          </button>
        </div>

        {/* Submit */}
        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </main>
  )
}