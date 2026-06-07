"use client";

import { useState } from "react";

<<<<<<< HEAD
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
      
      {/* CENTER CARD */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center mb-1">
          Live Q&A
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Ask questions and vote
        </p>

        {/* INPUT BOX */}
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

        {/* QUESTIONS LIST */}
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
                
                {/* VOTE BUTTON */}
                <button
                  onClick={() => upvote(q.id)}
                  className="border px-3 py-1 rounded hover:bg-gray-200"
                >
                  ▲ {q.votes}
                </button>

                {/* QUESTION TEXT */}
                <p className="text-gray-800">{q.text}</p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
=======
type QA = {
  id: number;
  question: string;
  answer: string;
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [qaList, setQaList] = useState<QA[]>([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

     const data = await res.json();
    

      setQaList((prev) => [
        {
          id: Date.now(),
          question,
          answer: data.answer,
        },
        ...prev,
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">
        AI Q&A
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-3 flex-1 rounded"
          placeholder="Ask anything..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="bg-black text-white px-5 rounded"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      <div className="space-y-4">
        {qaList.map((item) => (
          <div
            key={item.id}
            className="border rounded p-4"
          >
            <p className="font-semibold">
              Q: {item.question}
            </p>

            <p className="mt-2">
              A: {item.answer}
            </p>
          </div>
        ))}
      </div>
    </main>
>>>>>>> 0560f1df0a7f4882c8aa11f4715ec58cc100ae67
  );
}