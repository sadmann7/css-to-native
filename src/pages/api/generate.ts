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

  const prompt = `Convert the following CSS code: ${css} to react native stylesheet.`;

  const systemPrompt = `You are a CSS to react native stylesheet converter. You will be given some CSS code and you need to convert it to react native stylesheet. 
  You will convert all number-like values to numbers, and string-like to strings. You will automatically convert indirect css values to their React Native equivalents. You will find alternative for css values unsupported by React Native. 
  Make sure to convert shorthand css properties to their longhand equivalent. Make sure to convert scss, less, sass, stylus etc. to css.
  Make sure to only display the converted code, no further explaination is needed.  Make sure to add a curly brace at the start of the stylesheet, and a curly brace at the end of the converted react native stylesheet. Do not add an extra curly brace at the end of the stylesheet.
  For example:
  - Inputed css:
  font-size: 18px;
  line-height: 24px;
  color: red;
  - Outputed RN stylesheet:
  {
    fontSize: 18, 
    lineHeight: 24, 
    color: 'red'
  }

  If class name is used, use the class name as the key and the css code as the value. Make sure to convert multi word class names to camelCase. 
  Do not add any other characters to the class name.
  For example:
  - Iputed css:
  .cozy-text {
    font-size: 18px;
    line-height: 24px;
    color: red;
    font-weight: medium;
  }
  - Outputed RN stylesheet:
  .cozyText: {
    fontSize: 18,
    lineHeight: 24,
    color: 'red',
    fontWeight: '500'
  }

  If any CSS frameworks is used like tailwindcss, windicss etc., convert the utility classes to their corresponding CSS codes.
  For example:
  - inputed css: flex items-center justify-between rounded-t-md bg-zinc-700 px-4 py-0.5
  - outputed RN stylesheet:
  { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    borderTopLeftRadius: 4, 
    borderTopRightRadius: 4, 
    backgroundColor: '#4B5563', 
    paddingLeft: 16, 
    paddingRight: 16, 
    paddingTop: 2, 
    paddingBottom: 2 
  }
  `;

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemPrompt.replaceAll(/\s+/g, " "),
      },
      { role: "user", content: prompt },
    ],
    temperature: 0,
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
