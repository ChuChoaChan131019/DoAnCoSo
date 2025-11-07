import React, { useState } from "react";
import "./FAQ.css";
import IntroNavbar from "../components/IntroNavbar";

export default function FAQ({user, setUser}) {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handleClick = (questionId) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId);
  };

  return (
    <div className="jobs-root">
      <IntroNavbar user={user} setUser={setUser} />
      
      <div className="suggestions-container">
        <h2 className="suggestions-title">Suggestions</h2>

        <div className="question-box" onClick={() => handleClick(1)}>Q 1</div>
        {activeQuestion === 1 && (
          <div className="answer-box">
            <p>A 1 </p>
          </div>
        )}

        <div className="question-box" onClick={() => handleClick(2)}>Q 2</div>
        {activeQuestion === 2 && (
          <div className="answer-box">
            <p>A 2.</p>
          </div>
        )}

        <div className="question-box" onClick={() => handleClick(3)}>Q 3</div>
        {activeQuestion === 3 && (
          <div className="answer-box">
            <p>
              A 3 - <br />
              Dòng 2.<br />
              Dòng 3.
            </p>
          </div>
        )}

        <div className="question-box" onClick={() => handleClick(4)}>Q 4</div>
        {activeQuestion === 4 && (
          <div className="answer-box">
            <p>A 4 </p>
          </div>
        )}
      </div>
    </div>
  );
}