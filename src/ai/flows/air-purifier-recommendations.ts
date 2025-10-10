'use server';

/**
 * @fileOverview Provides personalized air purifier recommendations based on air quality, room size, and user preferences.
 *
 * - getAirPurifierRecommendations - A function that generates air purifier setting recommendations.
 * - AirPurifierRecommendationsInput - The input type for the getAirPurifierRecommendations function.
 * - AirPurifierRecommendationsOutput - The return type for the getAirPurifierRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AirPurifierRecommendationsInputSchema = z.object({
  pm25: z.number().describe('PM2.5 concentration in micrograms per cubic meter.'),
  pm10: z.number().describe('PM10 concentration in micrograms per cubic meter.'),
  co2: z.number().describe('CO2 concentration in ppm.'),
  vocs: z.number().describe('VOCs concentration in micrograms per cubic meter.'),
  roomSize: z.number().describe('Room size in square feet.'),
  userPreferences: z
    .string()
    .describe(
      'User preferences regarding air purifier usage, such as desired noise level, energy consumption, and sensitivity to allergens.'
    ),
});
export type AirPurifierRecommendationsInput = z.infer<typeof AirPurifierRecommendationsInputSchema>;

const AirPurifierRecommendationsOutputSchema = z.object({
  fanSpeed: z.string().describe('Recommended fan speed setting (e.g., low, medium, high, auto).'),
  mode: z
    .string()
    .describe(
      'Recommended air purifier mode (e.g., normal, sleep, allergen, turbo) based on air quality and user preferences.'
    ),
  scheduleAdjustment: z
    .string()
    .describe(
      'Suggestions for adjusting the air purifier schedule (e.g., run during peak pollution hours, reduce usage during low pollution periods).'
    ),
  additionalTips:
    z.string().describe('Additional tips for optimizing air purification based on the current situation.'),
});
export type AirPurifierRecommendationsOutput = z.infer<typeof AirPurifierRecommendationsOutputSchema>;

export async function getAirPurifierRecommendations(
  input: AirPurifierRecommendationsInput
): Promise<AirPurifierRecommendationsOutput> {
  return airPurifierRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'airPurifierRecommendationsPrompt',
  input: {schema: AirPurifierRecommendationsInputSchema},
  output: {schema: AirPurifierRecommendationsOutputSchema},
  prompt: `You are an expert in air purification, providing recommendations for air purifier settings based on air quality, room size, and user preferences.

  Based on the following information, provide specific and actionable recommendations for air purifier settings.

  Air Quality:
  - PM2.5: {{{pm25}}} μg/m3
  - PM10: {{{pm10}}} μg/m3
  - CO2: {{{co2}}} ppm
  - VOCs: {{{vocs}}} μg/m3

  Room Size: {{{roomSize}}} sq ft

  User Preferences: {{{userPreferences}}}

  Consider the following factors when making recommendations:
  - Current air quality levels and their potential health impacts.
  - The effectiveness of different air purifier settings for removing specific pollutants.
  - User preferences regarding noise level, energy consumption, and sensitivity to allergens.

  Provide recommendations for:
  - Fan Speed: (e.g., low, medium, high, auto)
  - Mode: (e.g., normal, sleep, allergen, turbo)
  - Schedule Adjustment: (e.g., run during peak pollution hours, reduce usage during low pollution periods)
  - Additional Tips: Any other relevant advice for optimizing air purification.

  Ensure your recommendations are clear, concise, and easy to implement.
  Use the output schema to ensure that the AI generates the output in the correct JSON format. The Zod descriptions should guide output generation.`,
});

const airPurifierRecommendationsFlow = ai.defineFlow(
  {
    name: 'airPurifierRecommendationsFlow',
    inputSchema: AirPurifierRecommendationsInputSchema,
    outputSchema: AirPurifierRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
