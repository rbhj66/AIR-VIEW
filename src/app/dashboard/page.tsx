import AirQualityCard from '@/components/dashboard/air-quality-card';
import DeviceControlCard from '@/components/dashboard/device-control-card';
import HistoricalDataChart from '@/components/dashboard/historical-data-chart';
import PredictionCard from '@/components/dashboard/prediction-card';
import RecommendationsCard from '@/components/dashboard/recommendations-card';
import { FlaskConical, Beaker, Wind } from 'lucide-react';

const generateChartData = (base: number) => {
  return Array.from({ length: 15 }, (_, i) => ({
    time: `${i * 2}h`,
    value: Math.floor(base + Math.random() * (base / 2) - base / 4),
  }));
};

const airQualityData = {
  pm25: {
    value: 12.5,
    unit: 'µg/m³',
    status: 'Good',
    chartData: generateChartData(12),
  },
  pm10: {
    value: 25,
    unit: 'µg/m³',
    status: 'Good',
    chartData: generateChartData(25),
  },
  co2: {
    value: 450,
    unit: 'ppm',
    status: 'Excellent',
    chartData: generateChartData(450),
  },
  voc: {
    value: 75,
    unit: 'ppb',
    status: 'Moderate',
    chartData: generateChartData(75),
  },
};

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AirQualityCard
          title="PM2.5"
          value={airQualityData.pm25.value}
          unit={airQualityData.pm25.unit}
          icon={<Wind />}
          status={airQualityData.pm25.status}
          chartData={airQualityData.pm25.chartData}
        />
        <AirQualityCard
          title="PM10"
          value={airQualityData.pm10.value}
          unit={airQualityData.pm10.unit}
          icon={<Wind />}
          status={airQualityData.pm10.status}
          chartData={airQualityData.pm10.chartData}
        />
        <AirQualityCard
          title="CO₂"
          value={airQualityData.co2.value}
          unit={airQualityData.co2.unit}
          icon={<Beaker />}
          status={airQualityData.co2.status}
          chartData={airQualityData.co2.chartData}
        />
        <AirQualityCard
          title="VOCs"
          value={airQualityData.voc.value}
          unit={airQualityData.voc.unit}
          icon={<FlaskConical />}
          status={airQualityData.voc.status}
          chartData={airQualityData.voc.chartData}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-8">
        <div className="lg:col-span-4">
          <HistoricalDataChart />
        </div>
        <div className="lg:col-span-3">
          <DeviceControlCard />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <PredictionCard />
        <RecommendationsCard initialAirQuality={airQualityData} />
      </div>
    </main>
  );
}
