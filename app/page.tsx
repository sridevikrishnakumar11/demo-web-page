"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  // LOAD DATA
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("id", { ascending: false });

    console.log("FETCH DATA:", data);
    console.log("FETCH ERROR:", error);

    if (data) setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ➕ ADD QUESTION
 const addQuestion = async () => {
  if (!question.trim()) return;

  const { data, error } = await supabase
    .from("questions")
    .insert([{ text: question, votes: 0 }])
    .select();

  console.log("INSERT RESULT:", data, error);

  if (error) return;

  if (data) {
    setQuestions((prev) => [data[0], ...prev]);
    setQuestion("");
  }
};

  // VOTE
  const upvote = async (id: number, votes: number) => {
    const { error } = await supabase
      .from("questions")
      .update({ votes: votes + 1 })
      .eq("id", id);

    console.log("VOTE ERROR:", error);

    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-center mb-6">
          Live Q&A (V2 Storage)
        </h1>

        {/* INPUT */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border rounded-lg px-4 py-3"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            onClick={addQuestion}
            className="bg-black text-white px-5 rounded-lg"
          >
            Ask
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {questions.map((q) => (
            <div
              key={q.id}
              className="flex justify-between items-center border p-4 rounded-lg bg-gray-50"
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
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}