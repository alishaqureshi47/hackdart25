"use client";

import React from "react";
import "./surveycard.css";

export function getTimeAgo(date: Date, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
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

interface SurveyCardProps {
  title: string;
  description: string;
  datePublished: Date;
  timeToFill: string;
  numQuestions: number;
  imageUrl: string;
}

const SurveyCard: React.FC<SurveyCardProps> = ({
  title,
  description,
  datePublished,
  timeToFill,
  numQuestions,
  imageUrl,
}) => {
  return (
    <div className="survey-card-container">
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
