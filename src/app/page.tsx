
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
                    <Link href="#translate">
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
      <section id="translate" className="w-full py-12 md:py-24 lg:py-32">
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
          <div className="mx-auto mt-12 max-w-2xl">
            <Tabs defaultValue="verbal-to-sign" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="verbal-to-sign">Verbal to Sign</TabsTrigger>
                <TabsTrigger value="sign-to-verbal">Sign to Verbal</TabsTrigger>
              </TabsList>
              <TabsContent value="verbal-to-sign">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Mic className="h-6 w-6 text-primary" /> Verbal to Sign
                    </CardTitle>
                    <CardDescription>Translate spoken language into sign language in real-time.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 text-center">
                    <p className="text-muted-foreground">Click the button below to open the translation portal where your speech will be converted into a sign language animation.</p>
                    <Button asChild className="w-full">
                      <Link href="/english-to-asl">
                        Open Verbal to Sign Portal <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="sign-to-verbal">
                 <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Video className="h-6 w-6 text-primary" /> Sign to Verbal
                    </CardTitle>
                    <CardDescription>Translate sign language from your camera into spoken words.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 text-center">
                    <p className="text-muted-foreground">Click the button below to open the translation portal where your signs will be converted into text and audio.</p>
                     <Button asChild className="w-full">
                      <Link href="/asl-to-english">
                        Open Sign to Verbal Portal <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </div>
        </div>
      </section>
    </div>
  );
}
