'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { aslToText } from '@/ai/flows/asl-to-text';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoFeed } from '@/components/video-feed';
import { Loader2, Video, Volume2, Mic, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AslToEnglishPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setVideoBlob(null);
      setTranslatedText(null);
      setAudioSrc(null);
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranslate = async () => {
    if (!videoBlob) return;
    
    setIsLoading(true);
    setTranslatedText(null);
    setAudioSrc(null);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(videoBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const result = await aslToText({ videoDataUri: base64data });
          setTranslatedText(result.englishText);
          
          if (result.englishText) {
            const audioResult = await textToSpeech(result.englishText);
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
          setIsLoading(false);
        }
      };
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: 'Failed to process video. Please try recording again.',
      });
      setIsLoading(false);
    }
  };
  
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
                  Record a video of ASL signs. Press Start/Stop to record a clip.
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
            {videoBlob && (
                <div className="space-y-4">
                    <Alert>
                        <AlertTitle>Recording Complete!</AlertTitle>
                        <AlertDescription>
                            Your video is ready. Press "Translate" to process it.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={handleTranslate} className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Mic className="mr-2 h-4 w-4" />
                      )}
                      Translate
                    </Button>
                </div>
            )}
          </div>

          <Card className="flex flex-col shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-6 w-6 text-primary" />
                English Output
              </CardTitle>
              <CardDescription>
                The translated English text and audio will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="w-full min-h-[16rem] rounded-lg border border-dashed p-4 flex flex-col justify-center items-center bg-muted/40 text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Translating and generating audio...</p>
                  </div>
                ) : translatedText ? (
                    <div className="space-y-4 text-left w-full">
                        <p className="text-lg text-card-foreground">{translatedText}</p>
                        {audioSrc && (
                            <audio ref={audioRef} src={audioSrc} controls className="w-full" />
                        )}
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
