"use client"

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { createSurvey } from "@/features/survey/services/createSurvey";
import styles from "./page.module.css";

const CATEGORY_IMAGES = [
  { label: "Business & Entrepreneurship",    img: "/business.png" },
  { label: "Creative & Design",              img: "/creative.png" },
  { label: "Technology & Innovation",         img: "/tech.png" },
  { label: "Social & Community",              img: "/social.png" },
  { label: "Health & Wellness",               img: "/health.png" },
  { label: "Environment & Sustainability",    img: "/env.png" },
]

export default function SurveyPage() {
  const { data: session, status } = useSession();
  const { userId } = useUser();
  if (status === "unauthenticated") {
    redirect("/login")
  }

  const [topic, setTopic] = useState("");
  const [objective, setObjective] = useState("");
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  
  // 1) Start with an empty array (no fields shown)
  const [questions, setQuestions] = useState<string[]>([])

  // Clean up any blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // When user picks a file
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      // free old blob
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // When user clicks a category
  function attachPreset(imgPath: string) {
    // clear file input so new uploads can fire change events
    if (fileInputRef.current) fileInputRef.current.value = ""
    // revoke old blob if any
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
    // set to static public image
    setPreviewUrl(imgPath)
  }

  // question handlers
  const addQuestion    = () => setQuestions((q) => [...q, ""])
  const removeQuestion = (i: number) => setQuestions((q) => q.filter((_, idx) => idx !== i))
  const updateQuestion = (i: number, v: string) => setQuestions((q) => q.map((x, idx) => idx === i ? v : x))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ topic, objective, questions })
    // call API
    if (!userId) {
      console.error("User ID is not available");
      return;
    }
    setIsCreatingSurvey(true);
    createSurvey(userId, topic, objective, questions) // pass author and info
      .then(() => {
        // Handle success (e.g., show a success message or redirect)
        console.log("Survey created successfully");
      })
      .catch((error) => {
        // Handle error (e.g., show an error message)
        console.error("Error creating survey:", error);
      })
      .finally(() => {
        // Reset the form or redirect after survey creation
        setIsCreatingSurvey(false);
        setTopic("");
        setObjective("");
        setQuestions([]);
        alert("Survey created successfully");
      });
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Create a survey</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* UPLOAD FIELD */}
        <div className={styles.uploadField}>
          <label htmlFor="header">Header Image (optional)</label>
          <input
            ref={fileInputRef}
            id="header"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* PRESET BUTTONS */}
        <div className={styles.categoryButtons}>
          {CATEGORY_IMAGES.map(({ label, img }) => (
            <button
              type="button"
              key={label}
              onClick={() => attachPreset(img)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* LIVE PREVIEW */}
        {previewUrl && (
          <div className={styles.headerPreview}>
            {/* <img> works for both blob: and /public URLs */}
            <img src={previewUrl} alt="Preview" className={styles.headerImg} />
          </div>
        )}

        {/* TOPIC & OBJECTIVE */}
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

        {/* DYNAMIC QUESTIONS */}
        <div className={styles.field}>
          <label>Specific Questions</label>
          {questions.map((q, idx) => (
            <div key={idx} className={styles.questionField}>
              <input
                type="text"
                placeholder={`Question ${idx + 1}`}
                value={q}
                onChange={(e) => updateQuestion(idx, e.target.value)}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeQuestion(idx)}
                aria-label="Remove question"
              >
                ✕
              </button>
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

        {/* SUBMIT */}
        <button type="submit" className={styles.button}>
          Create
        </button>
      </form>
    </main>
  )
}