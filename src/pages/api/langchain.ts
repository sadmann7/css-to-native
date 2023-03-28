import { ChatOpenAI } from "langchain/chat_models";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import type { NextApiRequest, NextApiResponse } from "next";

type Body = {
  css: string;
};

const chat = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
  maxTokens: 400,
  frequencyPenalty: 0,
  presencePenalty: 0,
  topP: 1,
  n: 1,
  streaming: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body as Body;

  try {
    const response = await generateCron(data.css);
    return res.status(200).json({ result: response, error: null });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Failed to generate cron", result: null });
  }
}

async function generateCron(prompt: string) {
  const cronPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `
       CONVERT THE FOLLOWING CSS CODE TO REACT NATIVE STYLESHEET:
         \`\`\`
            ${prompt}
            \`\`\`

            
        YOUR RESPONSE:
        `
    ),
  ]);

  const response = await chat.generatePrompt([
    await cronPrompt.formatPromptValue({
      text: prompt,
    }),
  ]);

  return response.generations[0][0].text;
}
