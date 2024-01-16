import React from 'react';
import { useLocation } from 'react-router-dom';
import './Report.css'; // Import your CSS file

const Report = () => {
  const location = useLocation();
  const { userAnswers, correctAnswers } = location.state || { userAnswers: [], correctAnswers: [] };

  return (
    <div className='main'>
    <div className="report-container">
      <h1 className="report-title">Quiz Report</h1>
      <div className="answers-section">
        <h2 className="section-title">User's Answers:</h2>
        <ul className="answers-list">
          {userAnswers.map((answer, index) => (
            <li key={index} className="answer-item">
              <span className="question-number">Question {answer.questionNumber}:</span>
              <span className="user-answer">Your answer - {answer.answer},</span>
              <span className="correct-answer">Correct answer - {correctAnswers[index]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default Report;
