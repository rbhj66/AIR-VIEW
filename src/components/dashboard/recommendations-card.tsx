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
import { Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getRecommendationsAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2" /> Get Recommendations
        </>
      )}
    </Button>
  );
}

interface RecommendationsCardProps {
  initialAirQuality: {
    pm25: { value: number | null };
    pm10: { value: number | null };
    co2: { value: number | null };
    vocs: { value: number | null };
  };
}

export default function RecommendationsCard({
  initialAirQuality,
}: RecommendationsCardProps) {
  const [state, formAction] = useActionState(
    getRecommendationsAction,
    initialState
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state.error && !state.fieldErrors) {
      toast({
        variant: 'destructive',
        title: 'Recommendation Failed',
        description: state.error,
      });
    }
  }, [state, toast]);

  const isLoading = initialAirQuality.pm25.value === null;

  return (
    <Card>
      <form action={formAction}>
        <input type="hidden" name="pm25" value={initialAirQuality.pm25.value ?? 0} />
        <input type="hidden" name="pm10" value={initialAirQuality.pm10.value ?? 0} />
        <input type="hidden" name="co2" value={initialAirQuality.co2.value ?? 0} />
        <input type="hidden" name="vocs" value={initialAirQuality.vocs.value ?? 0} />

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-primary" /> Purification Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered advice for optimal purifier settings based on your space
            and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomSize">Room Size (sq ft)</Label>
            <Input
              id="roomSize"
              name="roomSize"
              type="number"
              placeholder="e.g., 250"
              disabled={isLoading}
            />
            {state.fieldErrors?.roomSize && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.roomSize[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="userPreferences">Your Preferences</Label>
            <Textarea
              id="userPreferences"
              name="userPreferences"
              placeholder="e.g., 'I prefer quiet operation at night and am sensitive to dust.'"
              className="min-h-24"
              disabled={isLoading}
            />
            {state.fieldErrors?.userPreferences && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.userPreferences[0]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <SubmitButton />

          {state.result && (
            <Alert className="bg-accent/30">
              <Sparkles className="h-4 w-4" />
              <AlertTitle>AI Recommendations</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  <strong>Fan Speed:</strong> {state.result.fanSpeed}
                </p>
                <p>
                  <strong>Mode:</strong> {state.result.mode}
                </p>
                <p>
                  <strong>Schedule:</strong> {state.result.scheduleAdjustment}
                </p>
                <p>
                  <strong>Tips:</strong> {state.result.additionalTips}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
