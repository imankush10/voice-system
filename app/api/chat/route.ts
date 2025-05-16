import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { smoothStream, streamText } from "ai";

export const maxDuration = 30;

const apiKey = process.env.GOOGLE_API_KEY;
const google = createGoogleGenerativeAI({
  apiKey,
});

const prompt = `Greet the user in a friendly and professional tone without mentioning any names. Then, ask them to choose one of the following roles by either typing the number or the full name:
1-Frontend Engineer. 2-Backend Engineer. 3-DevOps Engineer. 4-Cybersecurity Engineer.
Once the user selects a role, ask them 4 relevant and role-specific questions that assess their knowledge, experience, or thought process in that area. Make sure the questions are clear, concise, and varied (not all theoretical or all practical).
Keep your tone helpful and engaging throughout.`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages)
  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    experimental_transform: smoothStream({
      chunking: "word",
      delayInMs: 10,
    }),
    system: prompt,
  });
  return result.toDataStreamResponse();
}
