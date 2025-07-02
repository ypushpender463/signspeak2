// Text-to-ASL translation flow using Genkit and Gemini.

'use server';

/**
 * @fileOverview Converts English text to ASL animation data.
 *
 * - textToAsl - A function that translates English text into ASL animation data.
 * - TextToAslInput - The input type for the textToAsl function.
 * - TextToAslOutput - The return type for the textToAsl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TextToAslInputSchema = z.object({
  englishText: z.string().describe('The English text to be translated to ASL.'),
});
export type TextToAslInput = z.infer<typeof TextToAslInputSchema>;

const TextToAslOutputSchema = z.object({
  aslAnimationData: z.string().describe('The ASL animation data in JSON format.'),
});
export type TextToAslOutput = z.infer<typeof TextToAslOutputSchema>;

export async function textToAsl(input: TextToAslInput): Promise<TextToAslOutput> {
  return textToAslFlow(input);
}

const prompt = ai.definePrompt({
  name: 'textToAslPrompt',
  input: {schema: TextToAslInputSchema},
  output: {schema: TextToAslOutputSchema},
  prompt: `You are a translator that converts English to ASL animation data (JSON format).

  Translate the following English text to ASL animation data:
  {{englishText}}

  Ensure the output is valid JSON.
  `,
});

const textToAslFlow = ai.defineFlow(
  {
    name: 'textToAslFlow',
    inputSchema: TextToAslInputSchema,
    outputSchema: TextToAslOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
