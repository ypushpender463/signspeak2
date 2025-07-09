
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

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

  const navItems = [
    { href: '/#translate', label: 'Translate', protected: true },
    { href: '/about', label: 'About', protected: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold">SignSpeak</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-4 text-sm lg:flex">
          {navItems.map((item) => 
            (!item.protected || user) && (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                (pathname === item.href || (pathname === '/' && item.href.startsWith('/#')))
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center">
            {user ? (
              <Button onClick={handleLogout} variant="outline">Logout</Button>
            ) : (
              pathname !== '/login' && (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
