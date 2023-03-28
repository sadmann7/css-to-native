import type { OpenAIStreamPayload } from "@/types/globals";
import { openaiStream } from "@/utils/openai";
import { tailwindcss } from "@/utils/tailwindcss";
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
        content: `You are css to react native stylesheet converter. You will be given some CSS code and you need to convert it to react native stylesheet. You will convert all number-like values to numbers, and string-like to strings. You will automatically convert indirect css values to their React Native equivalents. You will find alternative for css values unsupported by React Native. For example, you will convert gap-4 to margin: 16px.
        You will also consider shorthand css values during the conversion. You will only give the react native stylesheet object, no further description is needed. 
        If tailwindcss is used, you will compile the utility classes to vanilla css values first before converting to react native stylesheet. 
        Here are some utility values to css values mapping: ${tailwindcss.gaps}, ${tailwindcss.fontSizes}, ${tailwindcss.fontWeights}, ${tailwindcss.lineHeights}, ${tailwindcss.letterSpacings}.

        You can use the following code as a reference:
          {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 20,
          }
      
        You can also use the following website to convert CSS to React Native stylesheet: https://reactnative.dev/docs/stylesheet
        `,
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
