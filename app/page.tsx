"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  const addQuestion = () => {
    if (!question.trim()) return;

    setQuestions([
      {
        id: Date.now(),
        text: question,
        votes: 0,
      },
      ...questions,
    ]);

    setQuestion("");
  };

  const upvote = (id: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, votes: q.votes + 1 } : q
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-1">
          Live Q&A
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Ask questions and vote
        </p>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            onClick={addQuestion}
            className="bg-black text-white px-5 rounded-lg hover:bg-gray-800"
          >
            Ask
          </button>
        </div>

        {/* Questions */}
        <div className="space-y-3">

          {questions.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              No questions yet. Be the first to ask.
            </p>
          )}

          {questions.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between border rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center gap-3">
                
                <button
                  onClick={() => upvote(q.id)}
                  className="border px-3 py-1 rounded hover:bg-gray-200"
                >
                  ▲ {q.votes}
                </button>

                <p className="text-gray-800">{q.text}</p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}