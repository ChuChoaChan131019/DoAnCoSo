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

        <div className="question-box" onClick={() => handleClick(1)}>How long should I make cover letter or resume?</div>
        {activeQuestion === 1 && (
          <div className="answer-box">
            <p>Cover letter should be no more than one page in length. It should explain who you are and why you’re the best candidate for the job. It needs to be very concise yet keep the recruiter wanting to learn more. If you go any longer than a page, the person reading it will get bored. Resume should also be limited to one page. Recruiters spend only 6 seconds looking through your resume, so it’s important to keep it to one page filled with strong keywords to stand out.</p>
          </div>
        )}

        <div className="question-box" onClick={() => handleClick(2)}>What are the most important things to include in resume?</div>
        {activeQuestion === 2 && (
          <div className="answer-box">
            <p>Some essential things to include in your resume are your name, contact information, education history, work or internship experience, and related skills. All of these details should be tailored for each individual job application. Additionally, you can include professional organizations and special awards if you think they’re relevant.</p>
          </div>
        )}

        <div className="question-box" onClick={() => handleClick(3)}>When do I follow up after an interview?</div>
        {activeQuestion === 3 && (
          <div className="answer-box">
            <p>The best way to get this question answered is to ask the interviewer during your interview. Ask when the suitable time is for the follow up and the best way to reach out to your interviewer.</p>
          </div>
        )}

        <div className="question-box" onClick={() => handleClick(4)}>How do I respond to a request for salary expectations?</div>
        {activeQuestion === 4 && (
          <div className="answer-box">
            <p>You will come across this question in almost every interview. The suggested response is to mention that you prefer negotiable salary. However, a better answer is to ask about how much the company has budgeted for the position. Once you are acknowledge of that number, you can provide an appropriate desired salary range.</p>
          </div>
        )}
      </div>
    </div>
  );
}