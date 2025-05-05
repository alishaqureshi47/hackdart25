"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./dashboard-card.css";

export function getTimeAgo(date: Date | string, now: Date = new Date()): string {
  // Ensure we have a proper Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    console.error("Invalid date provided to getTimeAgo:", date);
    return "Invalid date";
  }
  
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Handle future dates
  if (seconds < 0) {
    return "In the future";
  }
  
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

export interface SurveyCardProps {
  id: string;
  title: string;
  description: string;
  datePublished: Date;
  timeToFill: string;
  numQuestions: number;
  imageUrl: string;
}

const SurveyCard: React.FC<SurveyCardProps> = ({
  id,
  title,
  description,
  datePublished,
  timeToFill,
  numQuestions,
  imageUrl,
}) => {
  const router = useRouter();

  const handleSurveyClick = () => {
    router.push(`/surveys/view?id=${id}`);
  };

  return (
    <div 
      className="survey-card-container"
      onClick={handleSurveyClick}
      style={{ cursor: "pointer" }}
    >

      <img src={imageUrl} alt="Survey" className="survey-card-image" />
      <div className="survey-card-content">
        <div className="survey-card-header">
          <h3 className="survey-card-title">{title}</h3>
          <span className="survey-card-time">{getTimeAgo(datePublished)}</span>
        </div>
        <p className="survey-card-description">{description}</p>
        <div className="survey-card-footer">
          <span className="survey-card-questions">{numQuestions} Questions</span>
          <span className="survey-card-duration">{timeToFill} min</span>
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;
