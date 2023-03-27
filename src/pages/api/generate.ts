import type { OpenAIStreamPayload } from "@/types/globals";
import { openaiStream } from "@/utils/openai";
import type { NextRequest } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not defined in .env file. Please add it there (see README.md for more details)."
  );
}

export const config = {
  runtime: "edge",
};

interface ExtendedNextRequest extends NextRequest {
  json: () => Promise<{
    css: string;
  }>;
}

export default async function handler(req: ExtendedNextRequest) {
  const { css } = await req.json();

  console.log({
    css,
  });

  const prompt = `Convert the following css code: ${css} to react native stylesheet.`;

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Your are a css (any type of css) to react native stylesheet converter. You will be given some css code, and you need to convert it to react native stylesheet. Make sure you can handle all the css properties. Make sure to convert all number-like values to numbers, and string-like to strings. Make sure to automatically convert indirect values to their React Native equivalents.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 400,
    stream: true,
    n: 1,
  };

  const stream = await openaiStream(payload);
  return new Response(stream);
}
