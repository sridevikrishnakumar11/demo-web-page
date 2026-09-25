
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // FETCH QUESTIONS
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("id", { ascending: false });

    console.log("FETCH:", data, error);

    if (data) {
      setQuestions(data);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ASK QUESTION
  const addQuestion = async () => {
    try {
      if (!question.trim() || loading) return;

      setLoading(true);

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

      console.log("AI RESPONSE:", aiData);

      if (!res.ok) {
        console.log("API ERROR:", aiData);
        return;
      }

      const { data: inserted, error } = await supabase
        .from("questions")
        .insert([
          {
            text: question,
            votes: 0,
            answer: aiData.answer,
            is_poll: false,
          },
        ])
        .select();

      if (error) {
        console.log("SUPABASE ERROR:", error);
        return;
      }

      console.log("INSERTED:", inserted);

      if (inserted && inserted.length > 0) {
        setQuestions((prev) => [inserted[0], ...prev]);
      }

      setQuestion("");
    } catch (err) {
      console.log("FRONTEND ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // POLL VOTE
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

  // UPVOTE QUESTION
  const upvote = async (id: number, votes: number) => {
    await supabase
      .from("questions")
      .update({
        votes: votes + 1,
      })
      .eq("id", id);

    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                QuerySphere
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Ask. Explore. Share.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              AI Powered
            </div>

          </div>
        </div>
      </header>


      {/* MAIN */}
      <main className="max-w-3xl mx-auto px-4 py-10">

        {/* INTRO */}
        <div className="text-center mb-8">

          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            What would you like to know?
          </h2>

          <p className="text-slate-500 mt-2">
            Ask a question and get an AI-powered answer.
          </p>

        </div>


        {/* ASK BOX */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-10">

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              className="flex-1 border border-slate-300 bg-slate-50 text-slate-900 rounded-xl px-4 py-3 outline-none placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              placeholder="Ask anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addQuestion();
                }
              }}
            />

            <button
              onClick={addQuestion}
              disabled={loading || !question.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white px-7 py-3 rounded-xl font-medium transition"
            >
              {loading ? "Thinking..." : "Ask"}
            </button>

          </div>

        </div>


        {/* QUESTIONS HEADER */}
        <div className="flex items-center justify-between mb-5">

          <h3 className="text-lg font-semibold text-slate-800">
            Community Questions
          </h3>

          <span className="text-sm text-slate-400">
            {questions.length}{" "}
            {questions.length === 1 ? "question" : "questions"}
          </span>

        </div>


        {/* QUESTIONS */}
        <div className="space-y-4">

          {questions.length === 0 ? (

            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">

              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-semibold">
                ?
              </div>

              <p className="text-slate-700 font-medium">
                No questions yet
              </p>

              <p className="text-slate-400 text-sm mt-1">
                Be the first to ask something.
              </p>

            </div>

          ) : (

            questions.map((q) => (

              <div
                key={q.id}
                className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition"
              >

                {/* QUESTION */}
                <div className="flex gap-4">

                  {/* UPVOTE */}
                  <button
                    onClick={() => upvote(q.id, q.votes || 0)}
                    className="flex flex-col items-center justify-center min-w-[55px] h-[55px] rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition"
                  >

                    <span className="text-sm">
                      ▲
                    </span>

                    <span className="text-sm font-medium">
                      {q.votes || 0}
                    </span>

                  </button>


                  {/* QUESTION CONTENT */}
                  <div className="flex-1">

                    <p className="text-base md:text-lg font-medium text-slate-800 leading-relaxed">
                      {q.text}
                    </p>


                    {/* POLL */}
                    {q.is_poll ? (

                      <div className="mt-5">

                        <div className="flex items-center gap-2 mb-3">

                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                            POLL
                          </span>

                        </div>


                        <div className="space-y-2">

                          <button
                            onClick={() =>
                              votePoll(
                                q.id,
                                "a",
                                q.votes_a || 0
                              )
                            }
                            className="w-full flex justify-between items-center border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 px-4 py-3 rounded-xl transition"
                          >

                            <span className="text-slate-700">
                              {q.option_a}
                            </span>

                            <span className="text-slate-400 text-sm">
                              {q.votes_a || 0} votes
                            </span>

                          </button>


                          <button
                            onClick={() =>
                              votePoll(
                                q.id,
                                "b",
                                q.votes_b || 0
                              )
                            }
                            className="w-full flex justify-between items-center border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 px-4 py-3 rounded-xl transition"
                          >

                            <span className="text-slate-700">
                              {q.option_b}
                            </span>

                            <span className="text-slate-400 text-sm">
                              {q.votes_b || 0} votes
                            </span>

                          </button>

                        </div>

                      </div>

                    ) : (

                      /* AI ANSWER */
                      <div className="mt-5 bg-blue-50/60 border border-blue-100 rounded-xl p-4">

                        <div className="flex items-center gap-2 mb-2">

                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>

                          <span className="text-sm font-semibold text-blue-700">
                            AI Answer
                          </span>

                        </div>

                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                          {q.answer || "No answer available."}
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </main>


      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white mt-16">

        <div className="max-w-5xl mx-auto px-6 py-6 text-center">

          <p className="text-sm text-slate-400">
            QuerySphere • AI-powered collaborative Q&A
          </p>

        </div>

      </footer>

    </div>
  );
}
