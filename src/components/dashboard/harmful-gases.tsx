'use client';

import AirQualityCard from '@/components/dashboard/air-quality-card';
import type { ChartDataPoint } from '@/lib/types';
import { FlaskConical, Thermometer, Droplets, Cloud } from 'lucide-react';

interface GasData {
  value: number | null;
  history: ChartDataPoint[];
}
interface TempHumData {
  value: number | null;
  history: ChartDataPoint[];
}

interface HarmfulGasesProps {
  isLoading: boolean;
  co2Data: GasData;
  vocsData: GasData;
  temperatureData: TempHumData;
  humidityData: TempHumData;
}

const getCo2Status = (value: number | null) => {
  if (value === null) return 'Loading';
  if (value < 1000) return 'Excellent';
  if (value < 2000) return 'Good';
  return 'Poor';
};

const getVocsStatus = (value: number | null) => {
    if (value === null) return 'Loading';
    if (value < 250) return 'Excellent';
    if (value < 500) return 'Good';
    return 'Poor';
};

const getTemperatureStatus = (value: number | null) => {
    if (value === null) return 'Loading';
    if (value >= 20 && value <= 25) return 'Comfortable';
    return 'Suboptimal';
};

const getHumidityStatus = (value: number | null) => {
    if (value === null) return 'Loading';
    if (value >= 30 && value <= 60) return 'Ideal';
    return 'Suboptimal';
}


export default function HarmfulGases({
  isLoading,
  co2Data,
  vocsData,
  temperatureData,
  humidityData
}: HarmfulGasesProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
       <AirQualityCard
        title="CO2"
        value={co2Data.value}
        unit="ppm"
        icon={<Cloud />}
        status={getCo2Status(co2Data.value)}
        chartData={co2Data.history}
      />
      <AirQualityCard
        title="VOCs"
        value={vocsData.value}
        unit="ppb"
        icon={<FlaskConical />}
        status={getVocsStatus(vocsData.value)}
        chartData={vocsData.history}
      />
      <AirQualityCard
        title="Temperature"
        value={temperatureData.value}
        unit="°C"
        icon={<Thermometer />}
        status={getTemperatureStatus(temperatureData.value)}
        chartData={temperatureData.history}
      />
      <AirQualityCard
        title="Humidity"
        value={humidityData.value}
        unit="%"
        icon={<Droplets />}
        status={getHumidityStatus(humidityData.value)}
        chartData={humidityData.history}
      />
    </div>
  );
}