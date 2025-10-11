'use client';
import { useUser, useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import packageJson from '../../../../package.json';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters.'),
});

type ProfileSchema = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(true);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userProfileRef);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user?.displayName) {
      setValue('displayName', user.displayName);
    }
    // Check local storage for notification settings
    const storedNotificationPref = localStorage.getItem('notificationsEnabled');
    if (storedNotificationPref !== null) {
      setAreNotificationsEnabled(JSON.parse(storedNotificationPref));
    }
  }, [user, setValue]);

  const handleProfileUpdate = async (data: ProfileSchema) => {
    if (!auth.currentUser) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
      });
      toast({
        title: 'Profile Updated',
        description: 'Your display name has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    }
  };

  const handleNotificationChange = (enabled: boolean) => {
    setAreNotificationsEnabled(enabled);
    localStorage.setItem('notificationsEnabled', JSON.stringify(enabled));
    toast({
      title: `Notifications ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `You will ${
        enabled ? '' : 'no longer '
      }receive air quality alerts.`,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit(handleProfileUpdate)}>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your public display name and email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    {...register('displayName')}
                    defaultValue={user?.displayName || ''}
                  />
                  {errors.displayName && (
                    <p className="text-sm text-destructive">
                      {errors.displayName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={(userProfile as any)?.phoneNumber || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Phone number is used for SMS notifications and cannot be
                    changed here.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive alerts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Air Quality Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when AQI is high.
                  </p>
                </div>
                <Switch
                  checked={areNotificationsEnabled}
                  onCheckedChange={handleNotificationChange}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Version Information</CardTitle>
              <CardDescription>
                Details about the current application version.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">App Version:</span>
                <span className="font-medium">{packageJson.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next.js Version:</span>
                <span className="font-medium">
                  {packageJson.dependencies.next}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">React Version:</span>
                <span className="font-medium">
                  {packageJson.dependencies.react}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

    