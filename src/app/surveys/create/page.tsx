"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, redirect } from "next/navigation"
import { createSurvey } from "@/features/survey/services/createSurvey";
import { useUser } from "@/contexts/UserContext";
import styles from "./page.module.css"
import FileInput from "@/shared/components/forms/FileInput";

const CATEGORY_IMAGES = [
  { label: "Business & Entrepreneurship",    img: "/business.png" },
  { label: "Creative & Design",              img: "/creative.png" },
  { label: "Technology & Innovation",         img: "/tech.png" },
  { label: "Social & Community",              img: "/social.png" },
  { label: "Health & Wellness",               img: "/health.png" },
  { label: "Environment & Sustainability",    img: "/env.png" },
]

export default function SurveyPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") redirect("/login");

  const { userId } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [topic, setTopic] = useState("")
  const [objective, setObjective] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [errors, setErrors] = useState<{ topic?: string; objective?: string }>({});


  // cleanup blob URLs
  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // manual file upload
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setSelectedFile(file || null)
    if (file) {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setCategory("") // clear dropdown
    }
  }

  // preset attach
  function attachPreset(imgPath: string) {
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(imgPath)
  }

  // dynamic questions
  const addQuestion    = () => setQuestions((q) => [...q, ""])
  const removeQuestion = (i: number) => setQuestions((q) => q.filter((_,idx) => idx!==idx))
  const updateQuestion = (i: number, v: string) => setQuestions((q) => q.map((x,idx)=> idx===i?v:x))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate inputs
    // Reset errors
    const newErrors: { topic?: string; objective?: string } = {};

    // Validate inputs
    if (!topic.trim()) {
      newErrors.topic = "Topic is required.";
    }
    if (!objective.trim()) {
      newErrors.objective = "Objective is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createSurvey(
        userId || "",
        topic, 
        objective,
        questions,
        selectedFile, // Pass the file if uploaded
        previewUrl // Pass the image path if selected
      );
      alert("Survey created successfully!");
      // redirect
      router.replace("/dashboard");
    } catch (error) {
      console.error("Failed to create survey:", error);
      alert("Failed to create survey.");
    }
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Create a survey</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {errors.objective && <p style={{ color: "red" }}>{errors.objective}</p>}

        {/* UPLOAD FIELD */}
        <FileInput
          id="header"
          label="Header Image (optional)"
          accept="image/*"
          onChange={handleFileChange}
          reference={fileInputRef}
        />

        {/* CATEGORY DROPDOWN */}
        <div className={styles.field}>
          <label htmlFor="category">Default Images (optional)</label>
          <select
            id="category"
            className={styles.categorySelect}
            value={category}
            onChange={(e) => {
              const img = e.target.value
              setCategory(img)
              if (img) attachPreset(img)
            }}
          >
            <option value="">— Pick a category —</option>
            {CATEGORY_IMAGES.map(({ label, img }) => (
              <option key={label} value={img}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* LIVE PREVIEW */}
        {previewUrl && (
          <div className={styles.headerPreview}>
            <img src={previewUrl} alt="Preview" className={styles.headerImg} />
          </div>
        )}

        {/* TOPIC */}
        <div className={styles.field}>
          <label htmlFor="topic">Topic <strong>*</strong></label>
          <input
            id="topic"
            type="text"
            placeholder="e.g. Customer Satisfaction"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>

        {/* OBJECTIVE */}
        <div className={styles.field}>
          <label htmlFor="objective">Objective <strong>*</strong></label>
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