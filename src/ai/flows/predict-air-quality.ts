'use server';

/**
 * @fileOverview An AI agent for predicting air quality based on historical data.
 *
 * - predictAirQuality - A function that predicts air quality.
 * - PredictAirQualityInput - The input type for the predictAirQuality function.
 * - PredictAirQualityOutput - The return type for the predictAirQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictAirQualityInputSchema = z.object({
  location: z.string().describe('The location for which to predict air quality.'),
  historicalData: z.string().describe('Historical air quality data in a readable format.'),
});
export type PredictAirQualityInput = z.infer<typeof PredictAirQualityInputSchema>;

const PredictAirQualityOutputSchema = z.object({
  predictedAirQuality: z.string().describe('The predicted air quality in the near future.'),
  unhealthyPeriodLikelihood: z
    .string()
    .describe('The likelihood of an unhealthy air quality period.'),
  recommendedActions: z.string().describe('Recommended actions based on the prediction.'),
});
export type PredictAirQualityOutput = z.infer<typeof PredictAirQualityOutputSchema>;

export async function predictAirQuality(input: PredictAirQualityInput): Promise<PredictAirQualityOutput> {
  return predictAirQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictAirQualityPrompt',
  input: {schema: PredictAirQualityInputSchema},
  output: {schema: PredictAirQualityOutputSchema},
  prompt: `You are an expert air quality forecaster.

  Based on the provided historical data for the location: {{{location}}}, predict the air quality in the near future.

  Historical Data:
  {{{historicalData}}}

  Also, determine the likelihood of an unhealthy air quality period and suggest recommended actions.

  Respond in a format consistent with the schema descriptions.`,
});

const predictAirQualityFlow = ai.defineFlow(
  {
    name: 'predictAirQualityFlow',
    inputSchema: PredictAirQualityInputSchema,
    outputSchema: PredictAirQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
