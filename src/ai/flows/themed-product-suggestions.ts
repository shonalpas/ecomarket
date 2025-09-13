
'use server';

/**
 * @fileOverview An AI agent that provides thematically related eco-friendly product suggestions based on the current shopping cart contents.
 *
 * - getThemedProductSuggestions - A function that takes cart contents as input and returns product suggestions.
 * - ThemedProductSuggestionsInput - The input type for the getThemedProductSuggestions function.
 * - ThemedProductSuggestionsOutput - The return type for the getThemedProductSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThemedProductSuggestionsInputSchema = z.object({
  cartContents: z
    .array(z.string())
    .describe('An array of product names currently in the shopping cart.'),
});
export type ThemedProductSuggestionsInput = z.infer<typeof ThemedProductSuggestionsInputSchema>;

const ThemedProductSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of thematically related eco-friendly product suggestions.'),
});
export type ThemedProductSuggestionsOutput = z.infer<typeof ThemedProductSuggestionsOutputSchema>;

export async function getThemedProductSuggestions(
  input: ThemedProductSuggestionsInput
): Promise<ThemedProductSuggestionsOutput> {
  return themedProductSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'themedProductSuggestionsPrompt',
  input: {schema: ThemedProductSuggestionsInputSchema},
  output: {schema: ThemedProductSuggestionsOutputSchema},
  prompt: `You are a helpful shopping assistant specializing in eco-friendly products.

  Based on the current contents of the user's shopping cart, suggest other thematically related eco-friendly products that the user might be interested in.
  The suggestions should reflect environmental or sustainability concerns.
  Be concise.

  Current cart contents: {{#each cartContents}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Suggestions:`, // Ensure cartContents is handled correctly by Handlebars
});

const themedProductSuggestionsFlow = ai.defineFlow(
  {
    name: 'themedProductSuggestionsFlow',
    inputSchema: ThemedProductSuggestionsInputSchema,
    outputSchema: ThemedProductSuggestionsOutputSchema,
  },
  async input => {
    if (input.cartContents.length === 0) {
      return { suggestions: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
