'use server';

/**
 * @fileOverview Translates ASL video to English text.
 *
 * - aslToText - A function that handles the ASL to text translation process.
 * - ASLToTextInput - The input type for the aslToText function.
 * - ASLToTextOutput - The return type for the aslToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ASLToTextInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a person signing ASL, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ASLToTextInput = z.infer<typeof ASLToTextInputSchema>;

const ASLToTextOutputSchema = z.object({
  englishText: z.string().describe('The translated English text.'),
});
export type ASLToTextOutput = z.infer<typeof ASLToTextOutputSchema>;

export async function aslToText(input: ASLToTextInput): Promise<ASLToTextOutput> {
  return aslToTextFlow(input);
}

const aslToTextPrompt = ai.definePrompt({
  name: 'aslToTextPrompt',
  input: {schema: ASLToTextInputSchema},
  output: {schema: ASLToTextOutputSchema},
  prompt: `You are an expert in American Sign Language (ASL) and English translation.

You will receive a video of a person signing in ASL. Your task is to translate the ASL signs into accurate and natural-sounding English text.

Here is the video:
{{media url=videoDataUri}}

Translate the ASL signs in the video to English text:
`, // Ensure the prompt ends properly for text generation.
});

const aslToTextFlow = ai.defineFlow(
  {
    name: 'aslToTextFlow',
    inputSchema: ASLToTextInputSchema,
    outputSchema: ASLToTextOutputSchema,
  },
  async input => {
    const {output} = await aslToTextPrompt(input);
    return output!;
  }
);
