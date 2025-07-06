import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Languages, Video, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Seamless Communication for All
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  SignSpeak offers real-time, video-to-video translation between spoken languages and sign languages, breaking down barriers and fostering inclusion.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                    <Link href="/english-to-asl">
                        Get Started
                    </Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              width="600"
              height="400"
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              data-ai-hint="communication connection"
            />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Translate Instantly</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose your translation direction and experience live, intuitive communication like never before.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-2 mt-12">
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
        </div>
      </section>
    </div>
  );
}
