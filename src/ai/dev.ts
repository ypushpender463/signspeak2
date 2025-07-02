import { config } from 'dotenv';
config();

import '@/ai/flows/english-to-text.ts';
import '@/ai/flows/asl-to-text.ts';
import '@/ai/flows/text-to-asl.ts';
import '@/ai/flows/text-to-speech.ts';
