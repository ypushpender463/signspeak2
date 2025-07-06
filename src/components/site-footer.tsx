
import Link from 'next/link';
import { Icons } from '@/components/icons';

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground">
            developed by sign speak team
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
        </div>
      </div>
    </footer>
  );
}
