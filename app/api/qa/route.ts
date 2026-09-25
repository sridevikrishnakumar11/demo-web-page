import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (typeof question !== "string" || !question.trim()) {
      return Response.json(
        { error: "Please enter a question." },
        { status: 400 }
      );
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: question.trim(),
        },
      ],
    });

    const answer =
      completion.choices?.[0]?.message?.content || "No answer";

    return Response.json({ answer });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}