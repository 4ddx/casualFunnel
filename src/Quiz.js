// Quiz.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const [questionList, setqList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [timer, setTimer] = useState(1800); // 30 minutes in seconds

  const setQuestions = async () => {
    const data_src = "https://opentdb.com/api.php?amount=15";
    try {
      const response = await axios.get(data_src);
      const data = response.data;
      setqList(data.results);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    setQuestions();
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    const timedOut = setTimeout(() => {
      navigate('/report', {
        state: {
          userAnswers: [...userAnswers, { questionNumber: currentQuestionIndex + 1, answer: selectedAnswer }],
          correctAnswers: questionList.map(({ correct_answer }) => correct_answer),
        },
      });
    }, timer * 1000);
    return () => {
      clearInterval(timerId);
      clearTimeout(timedOut);
    };
  }, [timer, navigate, currentQuestionIndex, userAnswers, questionList, selectedAnswer]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);

    const existingAnswerIndex = userAnswers.findIndex((answer) => answer.questionNumber === currentQuestionIndex + 1);

    if (existingAnswerIndex !== -1) {
      setUserAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = { questionNumber: currentQuestionIndex + 1, answer: selectedAnswer };
        return updatedAnswers;
      });
    } else {
      setUserAnswers((prevAnswers) => [...prevAnswers, { questionNumber: currentQuestionIndex + 1, answer: selectedAnswer }]);
    }

    setVisitedQuestions((prevVisited) => [...prevVisited, currentQuestionIndex]);
    setSelectedAnswer(null);

    if (currentQuestionIndex === questionList.length - 1 && selectedAnswer !== null) {
      navigate('/report', {
        state: {
          userAnswers: [...userAnswers, { questionNumber: currentQuestionIndex + 1, answer: selectedAnswer }],
          correctAnswers: questionList.map(({ correct_answer }) => correct_answer),
        },
      });
    }
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setVisitedQuestions((prevVisited) => [...prevVisited, currentQuestionIndex]);
    setSelectedAnswer(null);
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleQuestionNumberClick = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedAnswer(findUserAnswer(index + 1));

    if (!isQuestionVisited(index)) {
      setVisitedQuestions((prevVisited) => [...prevVisited, index]);
    }
  };

  const findUserAnswer = (questionNumber) => {
    const userAnswer = userAnswers.find((answer) => answer.questionNumber === questionNumber);
    return userAnswer ? userAnswer.answer : null;
  };

  const isQuestionVisited = (index) => {
    return visitedQuestions.includes(index);
  };

  return (
    <div className="quiz-container">
      <div className="header">
        <h1>Quiz</h1>
        <p>Time Remaining: {Math.floor(timer / 60)}:{timer % 60}</p>
      </div>
      {questionList.length > 0 && (
        <div className="questionBox">
          <h2>Question {currentQuestionIndex + 1}</h2>
          {questionList[currentQuestionIndex].question}
          <div className="answer-options">
            {questionList[currentQuestionIndex].incorrect_answers.map((answer, index) => (
              <div
                key={index}
                onClick={() => handleAnswerClick(answer)}
                className={`answer-option ${selectedAnswer === answer ? 'selected' : ''}`}
              >
                {answer}
              </div>
            ))}
            <div
              onClick={() => handleAnswerClick(questionList[currentQuestionIndex].correct_answer)}
              className={`answer-option ${selectedAnswer === questionList[currentQuestionIndex].correct_answer ? 'selected' : ''}`}
            >
              {questionList[currentQuestionIndex].correct_answer}
            </div>
          </div>
          <div className="navBtn">
            <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            {currentQuestionIndex === questionList.length - 1 ? (
              <button onClick={handleNextQuestion}>Submit</button>
            ) : (
              <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questionList.length - 1}>
                Next
              </button>
            )}
          </div>
        </div>
      )}

      <div className="indicators">
        {questionList.length > 0 && (
          <div>
            <h2>Question Numbers:</h2>
            <ul className="question-numbers">
              {questionList.map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleQuestionNumberClick(index)}
                    className={`question-number ${isQuestionVisited(index) ? 'visited' : ''}`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {userAnswers.length > 0 && (
          <div>
            <h2>User's Answers:</h2>
            <ul style={{display: 'flex', flexDirection: 'column', textAlign:'center', paddingInlineStart: '0px'}}>
              {userAnswers.map((answer, index) => (
                <li key={index}>
                  Question {answer.questionNumber}: {answer.answer}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
