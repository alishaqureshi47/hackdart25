"use client"
import { useState, useRef, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, redirect, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/firebase/firebase";
import { getUserId } from "@/features/auth/getUser";
import FileInput from "@/shared/components/forms/FileInput";
import styles from "./page.module.css";
import {
  FirebaseSurvey,
  SurveyQuestion,
  MultipleChoiceQuestion,
  TextQuestion,
  RangeQuestion,
} from "@/features/survey/types/surveyFirebaseTypes";
import { fetchSurveyById } from "@/features/survey/services/fetchSurveyById";

const CATEGORY_IMAGES = [
  { label: "Business & Entrepreneurship", img: "/business.png" },
  { label: "Creative & Design", img: "/creative.png" },
  { label: "Technology & Innovation", img: "/tech.png" },
  { label: "Social & Community", img: "/social.png" },
  { label: "Health & Wellness", img: "/health.png" },
  { label: "Environment & Sustainability", img: "/env.png" },
]

export default function EditSurveyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  if (status === "unauthenticated") {
    redirect("/login");
  }

  // Protect route

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditSurveyContent />
    </Suspense>
  );
}

function EditSurveyContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") redirect("/login");

  // Replace context with state variable
  const [userId, setUserId] = useState<string | null>(null);
  
  // Fetch user ID when session is available
  useEffect(() => {
    const fetchUserId = async () => {
      if (session?.user?.email) {
        try {
          const id = await getUserId(session.user.email);
          setUserId(id);
        } catch (error) {
          console.error("Failed to fetch user ID:", error);
        }
      }
    };
    
    fetchUserId();
  }, [session]);
  
  // Form state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [survey, setSurvey] = useState<FirebaseSurvey | null>(null);
  
  const params = useSearchParams();
  const surveyId = params.get("id");
  // Fetch survey data
  useEffect(() => {
    async function fetchSurvey() {
      try {
        setLoading(true);
        const loadedSurvey = await fetchSurveyById(surveyId || "");
        
        if (loadedSurvey) {
            const surveyWithId = {
                ...loadedSurvey,
                id: surveyId || '',
            }

            // Initialize form state
            setSurvey(surveyWithId);
            setTitle(surveyWithId.title);
            setDescription(surveyWithId.description);
            setQuestions(surveyWithId.questions);
            setPreviewUrl(surveyWithId.imageUrl || "");
          
            // Check if the current user is the author
            if (loadedSurvey.authorId !== userId) {
                alert("You do not have permission to edit this survey");
                router.push("/dashboard");
            }
        } 
        else {
            alert("Survey not found");
            router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching survey:", error);
        alert("Failed to load survey data");
      } finally {
        setLoading(false);
      }
    }
    
    if (userId) fetchSurvey();
  }, [surveyId, userId, router]);
  
  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);
  
  // Handle file change
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    if (file) {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCategory(""); // Clear dropdown
    }
  }
  
  // Preset attach
  function attachPreset(imgPath: string) {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(imgPath);
  }
  
  // Question management
  const addQuestion = (type: "multiple-choice" | "text" | "range") => {
    let newQuestion: SurveyQuestion;
    
    switch (type) {
      case "multiple-choice":
        newQuestion = {
          questionText: "",
          questionType: "multiple-choice",
          options: [""] // Start with one empty option
        };
        break;
      case "text":
        newQuestion = {
          questionText: "",
          questionType: "text"
        };
        break;
      case "range":
        newQuestion = {
          questionText: "",
          questionType: "range",
          rangeSize: 5 // Default range size
        };
        break;
    }
    
    setQuestions([...questions, newQuestion]);
  };
  
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  
  const updateQuestionText = (index: number, text: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = text;
    setQuestions(updatedQuestions);
  };
  
  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex] as MultipleChoiceQuestion;
    
    if (question.questionType === "multiple-choice") {
      question.options[optionIndex] = value;
      setQuestions(updatedQuestions);
    }
  };
  
  const addQuestionOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex] as MultipleChoiceQuestion;
    
    if (question.questionType === "multiple-choice") {
      question.options.push("");
      setQuestions(updatedQuestions);
    }
  };
  
  const removeQuestionOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex] as MultipleChoiceQuestion;
    
    if (question.questionType === "multiple-choice" && question.options.length > 1) {
      question.options = question.options.filter((_, i) => i !== optionIndex);
      setQuestions(updatedQuestions);
    }
  };
  
  const updateRangeSize = (questionIndex: number, size: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex] as RangeQuestion;
    
    if (question.questionType === "range") {
      question.rangeSize = size;
      setQuestions(updatedQuestions);
    }
  };
  
  // Save survey changes
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate form
    const newErrors: { title?: string; description?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (!survey?.id) {
      alert("Survey ID is missing");
      router.refresh();
      return;
    }
    
    try {
      let imageUrl = survey.imageUrl;
      
      // Upload new image if selected
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `surveys/${survey.id}/${selectedFile.name}`);
        
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      } else if (previewUrl && previewUrl !== survey.imageUrl) {
        // If using a preset image
        imageUrl = previewUrl;
      }
      
      // Update survey document
      const surveyRef = doc(db, "surveys", survey?.id);
      await updateDoc(surveyRef, {
        title,
        description,
        questions,
        imageUrl,
        updatedAt: new Date()
      });
      
      alert("Survey updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update survey:", error);
      alert("Failed to update survey.");
    }
  }
  
  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Loading survey data...</div>
      </main>
    );
  }
  
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Edit Survey</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* IMAGE UPLOAD */}
        <FileInput
          id="header"
          label="Header Image"
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
              const img = e.target.value;
              setCategory(img);
              if (img) attachPreset(img);
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
        
        {/* TITLE */}
        <div className={styles.field}>
          <label htmlFor="title">Title <strong>*</strong></label>
          <input
            id="title"
            type="text"
            placeholder="Survey title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {errors.title && <p className={styles.error}>{errors.title}</p>}
        </div>
        
        {/* DESCRIPTION */}
        <div className={styles.field}>
          <label htmlFor="description">Description <strong>*</strong></label>
          <textarea
            id="description"
            placeholder="Survey description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            required
          />
          {errors.description && <p className={styles.error}>{errors.description}</p>}
        </div>
        
        {/* QUESTIONS SECTION */}
        <div className={styles.questionsSection}>
          <h2>Questions</h2>
          
          {questions.map((question, index) => (
            <div key={index} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>Question {index + 1}</span>
                <span className={styles.questionType}>{question.questionType}</span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeQuestion(index)}
                >
                  ✕
                </button>
              </div>
              
              <div className={styles.field}>
                <label htmlFor={`question-${index}`}>Question Text <strong>*</strong></label>
                <input
                  id={`question-${index}`}
                  type="text"
                  placeholder="Enter your question"
                  value={question.questionText}
                  onChange={(e) => updateQuestionText(index, e.target.value)}
                  required
                />
              </div>
              
              {question.questionType === "multiple-choice" && (
                <div className={styles.optionsContainer}>
                  <label>Options <strong>*</strong></label>
                  {(question as MultipleChoiceQuestion).options.map((option, optionIndex) => (
                    <div key={optionIndex} className={styles.optionField}>
                      <input
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className={styles.removeOptionBtn}
                        onClick={() => removeQuestionOption(index, optionIndex)}
                        disabled={(question as MultipleChoiceQuestion).options.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.addOptionBtn}
                    onClick={() => addQuestionOption(index)}
                  >
                    + Add Option
                  </button>
                </div>
              )}
              
              {question.questionType === "range" && (
                <div className={styles.field}>
                  <label htmlFor={`range-${index}`}>Range Size</label>
                  <div className={styles.rangeField}>
                    <input
                      id={`range-${index}`}
                      type="number"
                      min="2"
                      max="10"
                      value={(question as RangeQuestion).rangeSize}
                      onChange={(e) => updateRangeSize(index, parseInt(e.target.value))}
                      className={styles.rangeInput}
                    />
                    <span className={styles.rangeHint}>
                      (Scale from 1 to {(question as RangeQuestion).rangeSize})
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className={styles.addQuestionBtns}>
            <button
              type="button"
              className={`${styles.addBtn} ${styles.mcqBtn}`}
              onClick={() => addQuestion("multiple-choice")}
            >
              + Multiple Choice
            </button>
            <button
              type="button"
              className={`${styles.addBtn} ${styles.textBtn}`}
              onClick={() => addQuestion("text")}
            >
              + Text Question
            </button>
            <button
              type="button"
              className={`${styles.addBtn} ${styles.rangeBtn}`}
              onClick={() => addQuestion("range")}
            >
              + Range Question
            </button>
          </div>
        </div>
        
        {/* SUBMIT */}
        <button type="submit" className={styles.button}>
          Save Changes
        </button>
      </form>
    </main>
  );
}