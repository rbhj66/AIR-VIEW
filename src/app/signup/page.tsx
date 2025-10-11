'use client';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore } from '@/firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createUserProfile } from '@/lib/create-user-profile';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .optional(),
});

type SignupSchema = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    setFirebaseError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // After user is created in Auth, create their profile in Firestore
      if (userCredential.user && firestore) {
        await createUserProfile(firestore, userCredential.user.uid, {
          email: userCredential.user.email || '',
          phoneNumber: data.phoneNumber || '',
          createdAt: new Date().toISOString(),
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
      setFirebaseError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setFirebaseError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // For Google Sign-in, we might not get a phone number upfront.
      // We still create a profile. The user can add their number later in settings.
      if (result.user && firestore) {
        await createUserProfile(
          firestore,
          result.user.uid,
          {
            email: result.user.email || '',
            createdAt: new Date().toISOString(),
          },
          true // merge true to not overwrite data if they sign in again
        );
      }
      router.push('/dashboard');
    } catch (error: any) {
      setFirebaseError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute left-4 top-4">
        <AppLogo />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number (for alerts)</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 555-555-5555"
                {...register('phoneNumber')}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            {firebaseError && (
              <p className="text-sm text-destructive">{firebaseError}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create account
            </Button>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
            >
              Sign up with Google
            </Button>
          </CardContent>
        </form>
        <CardFooter className="text-sm">
          Already have an account?{' '}
          <Button variant="link" asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    