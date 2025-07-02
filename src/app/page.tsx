import { EnglishToAslGateway } from '@/components/english-to-asl-gateway';
import { AslToEnglishGateway } from '@/components/asl-to-english-gateway';
import { Icons } from '@/components/icons';

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
      <main className="flex-1 w-full container py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
            Real-Time English & ASL Translation
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Bridge the communication gap with AI-powered translation. Convert written English to ASL animations and translate ASL videos into English text.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <EnglishToAslGateway />
          <AslToEnglishGateway />
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by an AI assistant. Powered by Next.js and Google GenAI.
          </p>
        </div>
      </footer>
    </div>
  );
}
