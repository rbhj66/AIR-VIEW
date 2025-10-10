'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { TrendingUp, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getPredictionAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Predicting...
        </>
      ) : (
        <>
          <Sparkles className="mr-2" /> Predict Quality
        </>
      )}
    </Button>
  );
}

export default function PredictionCard() {
  const [state, formAction] = useActionState(getPredictionAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error && !state.fieldErrors) {
      toast({
        variant: 'destructive',
        title: 'Prediction Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-primary" /> Predictive Air Quality
          </CardTitle>
          <CardDescription>
            Forecast future air quality based on location and historical data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., San Francisco, CA"
            />
            {state.fieldErrors?.location && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.location[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="historicalData">Historical Data (last 3 years)</Label>
            <Textarea
              id="historicalData"
              name="historicalData"
              placeholder="Paste historical data here, e.g., 'Jan 2023: 15 PM2.5, Feb 2023: 12 PM2.5...'"
              className="min-h-24"
            />
            {state.fieldErrors?.historicalData && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.historicalData[0]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <SubmitButton />

          {state.result && (
            <Alert className="bg-accent/30">
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Prediction Result</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  <strong>Predicted Quality:</strong>{' '}
                  {state.result.predictedAirQuality}
                </p>
                <p>
                  <strong>Unhealthy Period Likelihood:</strong>{' '}
                  {state.result.unhealthyPeriodLikelihood}
                </p>
                <p>
                  <strong>Recommendations:</strong>{' '}
                  {state.result.recommendedActions}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
