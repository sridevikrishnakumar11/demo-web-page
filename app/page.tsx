"use client";

import { useState } from "react";

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
  );
}