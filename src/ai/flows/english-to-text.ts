'use server';

/**
 * @fileOverview This file defines a Genkit flow for transcribing English speech to text.
 *
 * - englishToText - A function that handles the speech-to-text transcription process.
 * - EnglishToTextInput - The input type for the englishToText function.
 * - EnglishToTextOutput - The return type for the englishToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnglishToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'Audio data URI, must include MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type EnglishToTextInput = z.infer<typeof EnglishToTextInputSchema>;

const EnglishToTextOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the English audio.'),
});
export type EnglishToTextOutput = z.infer<typeof EnglishToTextOutputSchema>;

export async function englishToText(input: EnglishToTextInput): Promise<EnglishToTextOutput> {
  return englishToTextFlow(input);
}

const englishToTextPrompt = ai.definePrompt({
  name: 'englishToTextPrompt',
  input: {schema: EnglishToTextInputSchema},
  output: {schema: EnglishToTextOutputSchema},
  prompt: `Transcribe the following English audio to text:\n\nAudio: {{media url=audioDataUri}}`,
});

const englishToTextFlow = ai.defineFlow(
  {
    name: 'englishToTextFlow',
    inputSchema: EnglishToTextInputSchema,
    outputSchema: EnglishToTextOutputSchema,
  },
  async input => {
    const {output} = await englishToTextPrompt(input);
    return output!;
  }
);
