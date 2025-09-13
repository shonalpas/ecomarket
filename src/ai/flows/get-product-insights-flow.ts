
'use server';

/**
 * @fileOverview An AI agent that generates an interesting insight about a product.
 *
 * - getProductInsights - A function that takes product info and returns an insight.
 * - ProductInsightsInput - The input type for the getProductInsights function.
 * - ProductInsightsOutput - The return type for the getProductInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductInsightsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('The detailed description of the product.'),
});
export type ProductInsightsInput = z.infer<typeof ProductInsightsInputSchema>;

const ProductInsightsOutputSchema = z.object({
  insight: z
    .string()
    .describe('A single, concise, and interesting insight, tip, or fun fact about the product. Should be 1-2 sentences.'),
});
export type ProductInsightsOutput = z.infer<typeof ProductInsightsOutputSchema>;

export async function getProductInsights(
  input: ProductInsightsInput
): Promise<ProductInsightsOutput> {
  return productInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productInsightsPrompt',
  input: {schema: ProductInsightsInputSchema},
  output: {schema: ProductInsightsOutputSchema},
  prompt: `You are a helpful and creative assistant for an eco-friendly online store called EcoMarket.
  
  Based on the product name and description, generate a single, interesting "insight".
  This could be:
  - A surprising fun fact related to the product or its materials.
  - A creative or alternative way to use the product.
  - A specific, tangible benefit of its eco-friendliness.
  - A helpful tip for maintaining or getting the most out of the product.
  
  The insight should be short, engaging, and easy to understand (1-2 sentences). Do not repeat information that is already obvious from the description.

  Product Name: {{{productName}}}
  Description: {{{productDescription}}}
  `,
});

const productInsightsFlow = ai.defineFlow(
  {
    name: 'productInsightsFlow',
    inputSchema: ProductInsightsInputSchema,
    outputSchema: ProductInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
