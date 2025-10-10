'use client';
import { doc, setDoc, Firestore } from 'firebase/firestore';

interface DeviceData {
  name: string;
  location: string;
  isPoweredOn: boolean;
  mode: string;
  fanSpeed: number;
}

export function createPurifierDevice(
  firestore: Firestore,
  deviceId: string,
  data: DeviceData
) {
  const deviceRef = doc(firestore, 'air_purifier_devices', deviceId);
  setDoc(deviceRef, data);
}
