"use client"
import { useState } from "react"
import styles from "./page.module.css"

type Question =
  | { id: number; type: "text" | "email";          label: string; placeholder?: string }
  | { id: number; type: "textarea";                 label: string; placeholder?: string }
  | { id: number; type: "radio";      label: string; options: string[] }
  | { id: number; type: "checkbox";   label: string; options: string[] }
  | { id: number; type: "range";      label: string; min: number; max: number; step?: number }

const QUESTIONS: Question[] = [
  { id: 1, type: "text",     label: "What is your name?",                                    placeholder: "Your name" },
  { id: 2, type: "email",    label: "What is your email?",                                   placeholder: "name@example.com" },
  {
    id: 3,
    type: "radio",
    label: "How satisfied are you with our product?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very unsatisfied"],
  },
  {
    id: 4,
    type: "checkbox",
    label: "Which features do you use?",
    options: ["Feature A", "Feature B", "Feature C", "Feature D"],
  },
  { id: 5, type: "textarea", label: "Any additional comments?",                              placeholder: "Your feedback…" },
  // New range question
  { id: 6, type: "range",    label: "On a scale of 0–10, how likely are you to recommend us?", min: 0, max: 10, step: 1 },
]

export default function SurveyPage() {
  const [answers, setAnswers] = useState<Record<number, any>>({})

  function handleChange(id: number, value: any) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log("Survey answers:", answers)
    alert("Thanks for submitting!")
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Customer Satisfaction Survey</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {QUESTIONS.map((q) => (
          <div key={q.id} className={styles.questionCard}>
            <label className={styles.questionLabel}>{q.label}</label>

            {/* text/email */}
            {(q.type === "text" || q.type === "email") && (
              <input
                className={styles.input}
                type={q.type}
                placeholder={q.placeholder}
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}

            {/* textarea */}
            {q.type === "textarea" && (
              <textarea
                className={styles.textarea}
                placeholder={q.placeholder}
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}

            {/* radio */}
            {q.type === "radio" && (
              <div className={styles.options}>
                {q.options.map((opt) => (
                  <label key={opt} className={styles.option}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* checkbox */}
            {q.type === "checkbox" && (
              <div className={styles.options}>
                {q.options.map((opt) => {
                  const selected: string[] = answers[q.id] || []
                  return (
                    <label key={opt} className={styles.option}>
                      <input
                        type="checkbox"
                        value={opt}
                        checked={selected.includes(opt)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...selected, opt]
                            : selected.filter((x) => x !== opt)
                          handleChange(q.id, next)
                        }}
                      />
                      <span>{opt}</span>
                    </label>
                  )
                })}
              </div>
            )}

            {/* range slider */}
            {q.type === "range" && (
              <div className={styles.rangeWrapper}>
                <input
                  className={styles.rangeInput}
                  type="range"
                  min={q.min}
                  max={q.max}
                  step={q.step || 1}
                  value={answers[q.id] ?? q.min}
                  onChange={(e) => handleChange(q.id, Number(e.target.value))}
                />
                <span className={styles.rangeValue}>{answers[q.id] ?? q.min}</span>
              </div>
            )}
          </div>
        ))}

        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </main>
  )
}