"use client";

import React, { useState, useRef, useEffect } from "react";
import SurveyCard, { SurveyCardProps } from "@/shared/components/surveycard/surveycard";
import { deleteSurvey } from "@/features/survey/services/deleteSurvey";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const handleCopyLink = () => {
    // Copy the survey link to the clipboard
    const surveyLink = `${window.location.origin}/surveys/view?id=${props.id}`;
    navigator.clipboard.writeText(surveyLink).then(() => {
      alert("Survey link copied to clipboard!");
    });
  }

  const handleDeleteSurvey = async () => {
    // ask for confirmation first
    const confirmDelete = window.confirm("Are you sure you want to delete this survey?");
    if (!confirmDelete) return;
    // delete the survey
    await deleteSurvey(props.id);

    // success
    alert("Survey deleted successfully");
    // reload
    router.refresh();
  };

  return (
    <div className="your-survey-card-wrapper">
      <div className="your-survey-card-content">
        <SurveyCard {...props} />

        {/* Dots Button */}
        <div className="your-survey-card-dots-wrapper">
        <div className="your-survey-card-dots">
            ⋮
        </div>
        <div ref={menuRef} className="your-survey-card-dropdown">
            <button onClick={handleCopyLink}>Copy Link</button>
            <button onClick={handleDeleteSurvey}>Delete Survey</button>
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
