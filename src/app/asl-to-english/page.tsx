'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { aslToText } from '@/ai/flows/asl-to-text';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoFeed } from '@/components/video-feed';
import { Loader2, Video, Volume2, ArrowLeft, Square, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';

const TRANSLATION_INTERVAL = 5000; // 5 seconds

export default function AslToEnglishPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const translationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const processVideoChunk = useCallback(async (videoBlob: Blob) => {
    if (!videoBlob) return;
    
    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(videoBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const result = await aslToText({ videoDataUri: base64data });
          const newText = result.englishText;
          
          if (newText && newText.trim() !== translatedText?.trim()) {
            setTranslatedText(newText);
            const audioResult = await textToSpeech(newText);
            setAudioSrc(audioResult.audioDataUri);
          }
        } catch (err) {
            console.error(err);
            toast({
              variant: 'destructive',
              title: 'Translation Error',
              description: 'Failed to translate ASL video. Please try again.',
            });
        } finally {
          setIsProcessing(false);
        }
      };
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: 'Failed to process video. Please try recording again.',
      });
      setIsProcessing(false);
    }
  }, [toast, translatedText]);
  
  const startChunkRecording = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        processVideoChunk(blob);
      };

      mediaRecorderRef.current.start();
      
      // Stop recording after interval and the onstop handler will process it
      setTimeout(() => {
        if(mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
      }, TRANSLATION_INTERVAL);

    }
  }, [processVideoChunk]);

  const handleStartTranslating = () => {
    setIsTranslating(true);
    setTranslatedText('Starting live translation...');
    setAudioSrc(null);
  };

  const handleStopTranslating = () => {
    setIsTranslating(false);
    if (translationIntervalRef.current) {
      clearInterval(translationIntervalRef.current);
      translationIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    setIsProcessing(false);
    setTranslatedText('Translation stopped.');
  };

  useEffect(() => {
    if (isTranslating) {
      startChunkRecording(); // Start immediately
      translationIntervalRef.current = setInterval(startChunkRecording, TRANSLATION_INTERVAL);
    } else {
      if (translationIntervalRef.current) {
        clearInterval(translationIntervalRef.current);
        translationIntervalRef.current = null;
      }
    }
    
    return () => {
      if (translationIntervalRef.current) {
        clearInterval(translationIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isTranslating, startChunkRecording]);
  
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
  }, [audioSrc]);

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
                  <Video className="h-6 w-6 text-primary" />
                  ASL Input
                </CardTitle>
                <CardDescription>
                  Your camera feed is live. Press "Start Translating" for real-time translation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <VideoFeed videoRef={videoRef} />
                <div className="flex gap-4">
                  {!isTranslating ? (
                    <Button onClick={handleStartTranslating} className="w-full" disabled={isTranslating}>
                      <Play className="mr-2 h-4 w-4" />
                      Start Translating
                    </Button>
                  ) : (
                    <Button onClick={handleStopTranslating} className="w-full" variant="destructive" disabled={!isTranslating}>
                       <Square className="mr-2 h-4 w-4" />
                      Stop Translating
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="flex flex-col shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-6 w-6 text-primary" />
                English Output
              </CardTitle>
              <CardDescription>
                The translated English text and audio will appear here in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="w-full min-h-[16rem] rounded-lg border border-dashed p-4 flex flex-col justify-center items-center bg-muted/40 text-center">
                {isProcessing && !translatedText ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Translating...</p>
                  </div>
                ) : translatedText ? (
                    <div className="space-y-4 text-left w-full">
                        <p className="text-lg text-card-foreground">{translatedText}</p>
                        {audioSrc && (
                            <audio ref={audioRef} src={audioSrc} controls className="w-full mt-4" />
                        )}
                        {isProcessing && <p className="text-sm text-muted-foreground mt-2 flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Receiving new translation...</p>}
                    </div>
                ) : (
                  <p className="text-muted-foreground">
                    Translation will appear here.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
