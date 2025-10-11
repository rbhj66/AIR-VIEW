'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Message, Part } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

function toGenkitMessage(message: z.infer<typeof MessageSchema>): Message {
  return new Message(message.role, [Part.text(message.content)]);
}

export async function chat(input: ChatInput): Promise<string> {
  const { history, message } = input;

  const chat = ai.chat();

  const genkitHistory = history.map(toGenkitMessage);

  const { text } = await chat.send({
    history: genkitHistory,
    message: message,
  });

  return text;
}
