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
        <div className="your-survey-card-dots" onClick={() => setMenuOpen(!menuOpen)}>
          ⋮
        </div>

        {/* Dropdown menu (optional extra actions) */}
        {menuOpen && (
            <div ref={menuRef} className="your-survey-card-dropdown">
                <button onClick={() => {
                navigator.clipboard.writeText("this is da link!");
                alert("Link copied to clipboard!");
                }}>
                Copy Link
                </button>

                <button onClick={() => {
                if (confirm("Are you sure you want to delete this survey?")) {
                    console.log("Delete survey logic here!");
                    // 🚨 You can call a real delete function here later
                }
                }}>
                Delete Survey
                </button>
            </div>
            )}
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
