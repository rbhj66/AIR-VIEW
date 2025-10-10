'use server';

/**
 * @fileOverview This flow acts as a bridge between Firestore and the Wokwi hardware simulator.
 * It listens for changes to an air purifier device's state in Firestore and updates the simulation accordingly.
 *
 * - wokwiBridge - A Genkit flow that triggers on Firestore document changes.
 */

import { ai } from '@/ai/genkit';
import { onDocument } from 'genkit/firebase';
import { z } from 'genkit';
import { AirPurifierDeviceSchema } from '@/lib/zod-schemas';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// Wokwi webhook URL from environment variables
const WOKWI_WEBHOOK_URL = process.env.WOKWI_WEBHOOK_URL;

export const wokwiBridge = ai.defineFlow(
  {
    name: 'wokwiBridge',
    inputSchema: z.any(),
    outputSchema: z.void(),
    triggers: [
      onDocument({
        // Listen for updates on any document in the air_purifier_devices collection
        collection: 'air_purifier_devices/{deviceId}',
        firebase: {
          // You may need to configure this to point to your specific Firebase project
          // projectId: 'your-firebase-project-id'
        },
      }),
    ],
  },
  async (event) => {
    if (!WOKWI_WEBHOOK_URL) {
      console.warn("WOKWI_WEBHOOK_URL is not set. Skipping simulation update.");
      return;
    }
    
    // Extract the device data from the event
    const deviceData = event.data();
    if (!deviceData) {
      console.log('No data in the event. Likely a deletion.');
      return;
    }

    try {
      const parsedData = AirPurifierDeviceSchema.parse(deviceData);
      const ledValue = parsedData.isPoweredOn ? '1' : '0';

      console.log(`Device ${event.params.deviceId} power state: ${parsedData.isPoweredOn}. Setting LED to ${ledValue}`);
      
      // Send a request to the Wokwi webhook to update the LED
      await fetch(WOKWI_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          led: ledValue,
        }),
      });

    } catch (error) {
      console.error("Error processing device update:", error);
    }
  }
);
