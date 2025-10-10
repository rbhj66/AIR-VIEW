'use server';

import {
  getAirPurifierRecommendations,
  AirPurifierRecommendationsInput,
  AirPurifierRecommendationsOutput,
} from '@/ai/flows/air-purifier-recommendations';
import {
  predictAirQuality,
  PredictAirQualityInput,
  PredictAirQualityOutput,
} from '@/ai/flows/predict-air-quality';
import { z } from 'zod';

const recommendationSchema = z.object({
  roomSize: z.coerce.number().positive('Room size must be a positive number.'),
  userPreferences: z
    .string()
    .min(10, 'Please describe your preferences in more detail.'),
  pm25: z.coerce.number(),
  pm10: z.coerce.number(),
  co2: z.coerce.number(),
  vocs: z.coerce.number(),
});

type RecommendationState = {
  result?: AirPurifierRecommendationsOutput;
  error?: string;
  fieldErrors?: { [key: string]: string[] };
};

export async function getRecommendationsAction(
  prevState: RecommendationState,
  formData: FormData
): Promise<RecommendationState> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = recommendationSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      error: 'Invalid form data.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input: AirPurifierRecommendationsInput = {
    ...parsed.data,
    vocs: parsed.data.vocs,
  };

  try {
    const result = await getAirPurifierRecommendations(input);
    return { result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get recommendations. Please try again.' };
  }
}

const predictionSchema = z.object({
  location: z.string().min(2, 'Please enter a valid location.'),
  historicalData: z
    .string()
    .min(20, 'Please provide more historical data for an accurate prediction.'),
});

type PredictionState = {
  result?: PredictAirQualityOutput;
  error?: string;
  fieldErrors?: { [key: string]: string[] };
};

export async function getPredictionAction(
  prevState: PredictionState,
  formData: FormData
): Promise<PredictionState> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = predictionSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      error: 'Invalid form data.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input: PredictAirQualityInput = parsed.data;

  try {
    const result = await predictAirQuality(input);
    return { result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get prediction. Please try again.' };
  }
}
