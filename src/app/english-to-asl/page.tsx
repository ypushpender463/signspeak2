'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { englishToText } from '@/ai/flows/english-to-text';
import { textToAsl } from '@/ai/flows/text-to-asl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoFeed } from '@/components/video-feed';
import { Loader2, Mic, Languages, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function EnglishToAslPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [aslAnimation, setAslAnimation] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const { toast } = useToast();
  
  const handleStartRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
          chunks.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setAudioBlob(blob);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioBlob(null);
      setTranscribedText(null);
      setAslAnimation(null);
    } else {
        toast({
            variant: 'destructive',
            title: 'Camera/Microphone Error',
            description: 'Could not access media stream. Please check permissions.',
        });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranslate = async () => {
    if (!audioBlob) return;
    
    setIsLoading(true);
    setTranscribedText(null);
    setAslAnimation(null);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const textResult = await englishToText({ audioDataUri: base64data });
          setTranscribedText(textResult.transcription);
          
          if (textResult.transcription) {
            const aslResult = await textToAsl({ englishText: textResult.transcription });
            setAslAnimation(aslResult.aslAnimationData);
          }
        } catch (err) {
            console.error(err);
            toast({
              variant: 'destructive',
              title: 'Translation Error',
              description: 'Failed to translate speech. Please try again.',
            });
        } finally {
          setIsLoading(false);
        }
      };
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: 'Failed to process audio. Please try recording again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center">
            <Icons.logo className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold font-headline">SignSpeak</span>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full container py-8 md:py-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-6 w-6 text-primary" />
                  English Input
                </CardTitle>
                <CardDescription>
                  Record yourself speaking English. We'll capture your audio for translation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <VideoFeed videoRef={videoRef} />
                <div className="flex gap-4">
                  <Button onClick={handleStartRecording} className="w-full" disabled={isRecording}>
                    {isRecording && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Start Recording
                  </Button>
                  <Button onClick={handleStopRecording} className="w-full" disabled={!isRecording} variant="destructive">
                    Stop Recording
                  </Button>
                </div>
              </CardContent>
            </Card>
            {audioBlob && (
                <div className="space-y-4">
                    <Alert>
                        <AlertTitle>Recording Complete!</AlertTitle>
                        <AlertDescription>
                            Your audio is ready. Press "Translate" to process it.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={handleTranslate} className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Languages className="mr-2 h-4 w-4" />
                      )}
                      Translate
                    </Button>
                </div>
            )}
          </div>
          <Card className="flex flex-col shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-6 w-6 text-primary" />
                ASL Output
              </CardTitle>
              <CardDescription>
                The generated ASL animation and transcribed text will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
              <div className="w-full aspect-video rounded-lg border border-dashed flex items-center justify-center bg-muted/40 p-4">
                {isLoading && !aslAnimation ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>Generating Animation...</p>
                    </div>
                ) : aslAnimation ? (
                  <div className="text-center w-full flex items-center justify-center">
                    <Image src="https://placehold.co/400x300.png" alt="ASL Animation Placeholder" width={400} height={300} className="rounded-md" data-ai-hint="avatar animation" />
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center px-4">
                    <p>The generated ASL animation will be displayed here.</p>
                  </div>
                )}
              </div>
              {transcribedText && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-card-foreground">Transcribed Text</h3>
                  <p className="text-muted-foreground p-4 bg-muted/40 rounded-lg border">{transcribedText}</p>
                </div>
              )}
               {aslAnimation && (
                <div className="w-full">
                  <h3 className="text-sm font-semibold mb-2 text-card-foreground">ASL Animation Data (for debugging)</h3>
                  <pre className="mt-2 text-xs text-left bg-background rounded-md p-2 max-h-40 overflow-auto w-full border">
                      <code>{JSON.stringify(JSON.parse(aslAnimation), null, 2)}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
