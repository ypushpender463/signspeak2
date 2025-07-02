import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Languages, Video, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Icons.logo className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold font-headline">SignSpeak</span>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full container flex flex-col items-center justify-center py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
            Real-Time English & ASL Translation
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Bridge the communication gap with live video-to-video translation. Choose your translation direction to begin.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl">
          <Link href="/english-to-asl">
            <Card className="hover:border-primary/80 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-6 w-6 text-primary" />
                  English to ASL
                </CardTitle>
                <CardDescription>
                  Translate spoken English into a live ASL avatar animation.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end justify-between">
                <p className="text-sm font-medium text-primary">Start Translating</p>
                <ArrowRight className="h-5 w-5 text-primary" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/asl-to-english">
            <Card className="hover:border-primary/80 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-6 w-6 text-primary" />
                  ASL to English
                </CardTitle>
                <CardDescription>
                  Translate ASL video into spoken English in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end justify-between">
                <p className="text-sm font-medium text-primary">Start Translating</p>
                <ArrowRight className="h-5 w-5 text-primary" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            developed by sign speak team
          </p>
        </div>
      </footer>
    </div>
  );
}
