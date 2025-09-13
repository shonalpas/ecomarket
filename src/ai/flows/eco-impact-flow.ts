
'use server';

/**
 * @fileOverview An AI agent that generates an eco-impact report based on cart items.
 *
 * - getEcoImpactReport - A function that takes cart contents and returns an impact statement.
 * - EcoImpactReportInput - The input type for the getEcoImpactReport function.
 * - EcoImpactReportOutput - The return type for the getEcoImpactReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EcoImpactReportInputSchema = z.object({
  cartContents: z
    .array(z.string())
    .describe('An array of product names currently in the shopping cart.'),
});
export type EcoImpactReportInput = z.infer<typeof EcoImpactReportInputSchema>;

const EcoImpactReportOutputSchema = z.object({
  report: z
    .string()
    .describe('A short, encouraging summary of the positive environmental impact of the items in the cart.'),
});
export type EcoImpactReportOutput = z.infer<typeof EcoImpactReportOutputSchema>;

export async function getEcoImpactReport(
  input: EcoImpactReportInput
): Promise<EcoImpactReportOutput> {
  return ecoImpactReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ecoImpactReportPrompt',
  input: {schema: EcoImpactReportInputSchema},
  output: {schema: EcoImpactReportOutputSchema},
  prompt: `You are an encouraging and positive eco-assistant for an online store called EcoMarket.
  
  Based on the items in the user's cart, write a short, 1-2 sentence summary of the positive environmental impact they are making.
  Focus on the benefits of their choices (e.g., reducing plastic, choosing sustainable materials). Be specific but concise.
  Start with a positive affirmation like "Great choices!" or "You're making a difference!".

  Current cart contents: {{#each cartContents}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  `,
});

const ecoImpactReportFlow = ai.defineFlow(
  {
    name: 'ecoImpactReportFlow',
    inputSchema: EcoImpactReportInputSchema,
    outputSchema: EcoImpactReportOutputSchema,
  },
  async input => {
    if (input.cartContents.length === 0) {
      return { report: '' };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
