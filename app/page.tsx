"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  // 🔄 FETCH
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("id", { ascending: false });

    console.log("FETCH:", data, error);

    if (data) setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ➕ ADD
 
  const addQuestion = async () => {
try {
if (!question.trim()) return;

const res = await fetch("/api/qa", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    question,
  }),
});

const aiData = await res.json();

if (!res.ok) {
  console.log(aiData);
  return;
}

const { data: inserted, error } = await supabase
  .from("questions")
  .insert([
    {
      text: question,
      votes: 0,
      answer: aiData.answer,
    },
  ])
  .select();

if (error) {
  console.log("SUPABASE ERROR:", error);
  return;
}

if (inserted && inserted.length > 0) {
  setQuestions((prev) => [inserted[0], ...prev]);
}

setQuestion("");

} catch (err) {
console.log("FRONTEND ERROR:", err);
}
};
const votePoll = async (
  id: number,
  side: "a" | "b",
  currentVotes: number
) => {
  const field = side === "a" ? "votes_a" : "votes_b";

  await supabase
    .from("questions")
    .update({
      [field]: currentVotes + 1,
    })
    .eq("id", id);

  fetchQuestions();
};
//👍 VOTE
  const upvote = async (id: number, votes: number) => {
    await supabase
      .from("questions")
      .update({ votes: votes + 1 })
      .eq("id", id);

    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center p-6">
      <div className="w-full max-w-xl bg-gray-800 rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-center mb-6">
          QA App V3 🚀
        </h1>

        {/* INPUT */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border border-gray-600 bg-gray-900 text-white rounded-lg px-4 py-3"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            onClick={addQuestion}
            className="bg-blue-500 text-white px-5 rounded-lg"
          >
            Ask
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {questions.length === 0 ? (
            <p className="text-gray-400 text-center">No questions yet</p>
          ) : (
            questions.map((q) => (
  <div
    key={q.id}
    className="bg-gray-900 border border-gray-700 p-4 rounded-lg"
  >
    <div className="flex items-center gap-3">
      <button
        onClick={() => upvote(q.id, q.votes)}
        className="border px-3 py-1 rounded"
      >
        ▲ {q.votes}
      </button>

      <p>{q.text}</p>
    </div>

   {q.is_poll ? (
  <div className="mt-3 space-y-2">
    <button
      onClick={() => votePoll(q.id, "a", q.votes_a)}
      className="block w-full border p-2 rounded"
    >
      {q.option_a} ({q.votes_a})
    </button>

    <button
      onClick={() => votePoll(q.id, "b", q.votes_b)}
      className="block w-full border p-2 rounded"
    >
      {q.option_b} ({q.votes_b})
    </button>
  </div>
) : (
  <p className="mt-3 text-green-400">
    {q.answer}
  </p>
)}
  </div>
))
)}
        </div>

      </div>
    </div>
  );
}