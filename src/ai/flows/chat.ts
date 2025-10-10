'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

export async function chat(input: ChatInput): Promise<string> {
  const { history, message } = input;

  const chat = ai.getModel('googleai/gemini-2.5-flash').chat();

  const { text } = await chat.send({
    history,
    messages: [{ role: 'user', content: message }],
  });

  return text;
}
