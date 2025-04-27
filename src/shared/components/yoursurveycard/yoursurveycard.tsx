"use client";

import React, { useState, useRef, useEffect } from "react";
import SurveyCard, { SurveyCardProps } from "@/shared/components/surveycard/surveycard";
import "./yoursurveycard.css";

interface YourSurveyCardProps extends SurveyCardProps {
  onEdit: () => void;
  onViewResponses: () => void;
  onClick: () => void;
}

const YourSurveyCard: React.FC<YourSurveyCardProps> = ({
  onEdit,
  onViewResponses,
  onClick,
  ...props
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="your-survey-card-wrapper">
      <div className="your-survey-card-content">
        <SurveyCard {...props} onClick={onClick} />

        {/* Dots Button */}
        <div className="your-survey-card-dots-wrapper">
        <div className="your-survey-card-dots">
            ⋮
        </div>
        <div ref={menuRef} className="your-survey-card-dropdown">
            <button>Copy Link</button>
            <button>Delete Survey</button>
        </div>
        </div>

      </div>

      {/* 🛠 Always visible Edit and View buttons */}
      <div className="your-survey-card-buttons">
        <button className="edit-button" onClick={onEdit}>Edit</button>
        <button className="view-responses-button" onClick={onViewResponses}>View Responses</button>
      </div>
    </div>
  );
};

export default YourSurveyCard;
