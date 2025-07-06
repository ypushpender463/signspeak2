'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { englishToText } from '@/ai/flows/english-to-text';
import { textToAsl } from '@/ai/flows/text-to-asl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoFeed } from '@/components/video-feed';
import { Loader2, Mic, Languages, Play, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TRANSLATION_INTERVAL = 5000; // 5 seconds

export default function EnglishToAslPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [aslAnimation, setAslAnimation] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const translationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  
  const processAudioChunk = useCallback(async (audioBlob: Blob) => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    setAslAnimation(null); // Clear old animation
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const textResult = await englishToText({ audioDataUri: base64data });
          const newText = textResult.transcription;

          if (newText && newText.trim()) {
            setTranscribedText(current => current ? `${current} ${newText}` : newText);
            const aslResult = await textToAsl({ englishText: newText });
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
          setIsProcessing(false);
        }
      };
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: 'Failed to process audio. Please try recording again.',
      });
      setIsProcessing(false);
    }
  }, [toast]);

  const startChunkRecording = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      // Ensure we have a stream with audio
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream.getAudioTracks().length === 0) {
        toast({
          variant: 'destructive',
          title: 'No Audio Track',
          description: 'Microphone not detected. Please check permissions and hardware.'
        });
        setIsTranslating(false);
        return;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
          chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          if(blob.size > 0) {
            processAudioChunk(blob);
          }
      };

      mediaRecorderRef.current.start();
      
      setTimeout(() => {
        if(mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
      }, TRANSLATION_INTERVAL);

    } else {
        toast({
            variant: 'destructive',
            title: 'Camera/Microphone Error',
            description: 'Could not access media stream. Please check permissions.',
        });
        setIsTranslating(false);
    }
  }, [processAudioChunk, toast]);

  const handleStartTranslating = () => {
    setIsTranslating(true);
    setTranscribedText('');
    setAslAnimation(null);
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
  };
  
  useEffect(() => {
    if (isTranslating) {
      startChunkRecording();
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

  return (
    <div className="container py-8 md:py-12">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-6 w-6 text-primary" />
                English Input
              </CardTitle>
              <CardDescription>
                Start speaking and we'll translate in real-time. Your camera is on for presence.
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
              <Languages className="h-6 w-6 text-primary" />
              ASL Output
            </CardTitle>
            <CardDescription>
              The generated ASL animation and transcribed text will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col gap-4">
            <div className="w-full aspect-video rounded-lg border border-dashed flex items-center justify-center bg-muted/40 p-4">
              {isProcessing && !aslAnimation ? (
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
                  <p>The generated ASL animation will be displayed here once you start translating.</p>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-semibold mb-2 text-card-foreground">Full Transcription</h3>
              <div className="text-muted-foreground p-4 bg-muted/40 rounded-lg border min-h-[6rem]">
                {transcribedText || "..."}
                {isTranslating && <span className="inline-block w-2 h-2 ml-1 bg-primary rounded-full animate-pulse"></span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
