'use server';

/**
 * @fileOverview An AI agent that summarizes the text content of a webpage.
 *
 * - summarizePage - A function that takes text and returns a concise summary.
 * - SummarizePageInput - The input type for the summarizePage function.
 * - SummarizePageOutput - The return type for the summarizePage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePageInputSchema = z.object({
  textContent: z.string().describe('The full text content of the webpage to be summarized.'),
});
export type SummarizePageInput = z.infer<typeof SummarizePageInputSchema>;

const SummarizePageOutputSchema = z.object({
  summary: z.string().describe('A concise, easy-to-read summary of the provided text.'),
});
export type SummarizePageOutput = z.infer<typeof SummarizePageOutputSchema>;

export async function summarizePage(input: SummarizePageInput): Promise<SummarizePageOutput> {
  return summarizePageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePagePrompt',
  input: {schema: SummarizePageInputSchema},
  output: {schema: SummarizePageOutputSchema},
  prompt: `You are an expert at summarizing web content for accessibility.
  
  Analyze the text provided and generate a simple, clear, and concise summary.
  Focus on the main points and key information. Use short sentences and simple vocabulary.
  
  Text to summarize:
  {{{textContent}}}
  `,
});

const summarizePageFlow = ai.defineFlow(
  {
    name: 'summarizePageFlow',
    inputSchema: SummarizePageInputSchema,
    outputSchema: SummarizePageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
