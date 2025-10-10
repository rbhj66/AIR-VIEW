import { z } from 'zod';

export const AirPurifierDeviceSchema = z.object({
  id: z.string().optional(), // ID is usually handled by Firestore documents
  name: z.string(),
  location: z.string(),
  isPoweredOn: z.boolean(),
  fanSpeed: z.number().min(0).max(100),
  mode: z.enum(['auto', 'sleep', 'turbo', 'allergen']),
});

export type AirPurifierDevice = z.infer<typeof AirPurifierDeviceSchema>;
