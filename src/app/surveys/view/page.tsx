"use client"
import { useEffect, useState, Suspense } from "react"
import { redirect, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./page.module.css"
import { SurveyQuestion, FirebaseSurvey, SurveyAnswer } from "@/features/survey/types/surveyFirebaseTypes";
import { getUserId } from "@/features/auth/getUser";
import { fetchSurveyById } from "@/features/survey/services/fetchSurveyById";
import { submitSurveyResponse } from "@/features/survey/services/submitSurveyResponse";

export default function SurveyViewPage() {
  const { data: session, status } = useSession();

  // Initial auth check
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  return (
    <Suspense fallback={<div>Loading survey...</div>}>
      <SurveyViewContent />
    </Suspense>
  );
}

function SurveyViewContent() {
  const [survey, setSurvey] = useState<FirebaseSurvey | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const { data: session, status } = useSession();
  if (status === "unauthenticated") redirect("/login");

  // Replace context with state variable
  const [userId, setUserId] = useState<string | null>(null);
  // Rest of your state variables remain the same
  
  // Fetch user ID when session is available
  useEffect(() => {
    const fetchUserId = async () => {
      if (session?.user?.email) {
        try {
          const id = await getUserId(session.user.email);
          setUserId(id);
        } catch (error) {
          console.error("Failed to fetch user ID:", error);
          // Handle error - redirect to login or show message
        }
      }
    };
    
    fetchUserId();
  }, [session]);
  const searchParams = useSearchParams();
  const surveyId = searchParams.get("id");

  // fetch survey data before rendering
  useEffect(() => {
    async function fetchSurvey() {
      if (!surveyId || typeof surveyId !== "string" || surveyId.trim() === "") {
        redirect("/notfound");
      }
      const survey = await fetchSurveyById(surveyId);
      if (!survey) {
        console.error("Survey not found")
        return
      }
      setSurvey(survey);
      setQuestions(survey.questions);
    }
    

    fetchSurvey();
  }, [surveyId]);

  function handleChange(id: number, value: any) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Survey answers:", answers)
    // send answers to server
    const surveyAnswers: SurveyAnswer[] = questions.map((q, index) => {
      if (q.questionType === "multiple-choice") {
        return {
          selectedOption: answers[index],
          selectedOptionIndex: q.options.indexOf(answers[index]),
          questionType: q.questionType,
        }
      } else if (q.questionType === "text") {
        return {
          answerText: answers[index],
          questionType: q.questionType,
        }
      } else if (q.questionType === "range") {
        return {
          selectedValue: answers[index] || 1,
          selectedValueIndex: answers[index] - 1 || 0,
          questionType: q.questionType,
        }
      } else {
        throw new Error(`Invalid answer for question ${index}`); // should never happen
      }
    })

    await submitSurveyResponse(surveyId || '', surveyAnswers , userId || '');

    alert("Survey submitted successfully!");
    // redirect to dashboard
    redirect("/dashboard");
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Customer Satisfaction Survey</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {questions.map((q, index) => (
          <div key={index} className={styles.questionCard}>
            <label className={styles.questionLabel}>{q.questionText}</label>

            {/* textarea */}
            {q.questionType === "text" && (
              <textarea
                className={styles.textarea}
                placeholder="Write here..."
                value={answers[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                style={{resize: "none"}}
                required
              />
            )}

            {/* radio */}
            {q.questionType === "multiple-choice" && (
              <div className={styles.options}>
                {q.options.map((opt, i) => (
                  <label key={opt} className={styles.option}>
                    <input
                      type="radio"
                      name={`q${index}-${i}`}
                      value={opt}
                      checked={answers[index] === opt}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* checkbox (for the future) */}
            {/* {q.type === "checkbox" && (
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
            )} */}

            {/* range slider */}
            {q.questionType === "range" && (
              <div className={styles.rangeWrapper}>
                <input
                  required
                  className={styles.rangeInput}
                  type="range"
                  min={1}
                  max={q.rangeSize}
                  step={1}
                  value={answers[index] ?? 1}
                  onChange={(e) => handleChange(index, Number(e.target.value))}
                />
                <span className={styles.rangeValue}>{answers[index] ?? 1}</span>
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