'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function Home() {
  const router = useRouter();
  const [fromLang, setFromLang] = useState('english-verbal');
  const [toLang, setToLang] = useState('asl-sign');

  const languageOptions = [
    { value: 'english-verbal', label: 'English (Verbal)', type: 'verbal' },
    { value: 'asl-sign', label: 'ASL (Sign)', type: 'sign' },
  ];

  const handleTranslate = () => {
    const fromType = languageOptions.find((l) => l.value === fromLang)?.type;
    const toType = languageOptions.find((l) => l.value === toLang)?.type;

    if (fromType === 'verbal' && toType === 'sign') {
      router.push('/english-to-asl');
    } else if (fromType === 'sign' && toType === 'verbal') {
      router.push('/asl-to-english');
    }
  };

  const isSelectionValid = () => {
    const fromType = languageOptions.find((l) => l.value === fromLang)?.type;
    const toType = languageOptions.find((l) => l.value === toLang)?.type;
    return fromType !== toType;
  };

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
          <div className="mx-auto mt-12 max-w-2xl">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Create a Translation</CardTitle>
                    <CardDescription>Select your languages to begin your real-time translation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-end gap-4">
                        <div className="w-full space-y-2">
                            <Label htmlFor="from-language">From</Label>
                            <Select value={fromLang} onValueChange={setFromLang}>
                                <SelectTrigger id="from-language">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languageOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0 mb-2" />
                         <div className="w-full space-y-2">
                            <Label htmlFor="to-language">To</Label>
                            <Select value={toLang} onValueChange={setToLang}>
                                <SelectTrigger id="to-language">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                     {languageOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <Button onClick={handleTranslate} disabled={!isSelectionValid()} className="w-full">
                        Start Translating
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
        </div>
      </section>
    </div>
  );
}
