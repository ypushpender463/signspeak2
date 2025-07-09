
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Mail } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: 'destructive',
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <Card className="mx-auto max-w-2xl shadow-lg">
        <CardHeader className="text-center items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
            <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">{user.displayName}</CardTitle>
          <CardDescription>Your SignSpeak Profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/40">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{user.email}</span>
          </div>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
