'use client';

import { useState } from 'react';
import { aslToText } from '@/ai/flows/asl-to-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoFeed } from '@/components/video-feed';
import { Loader2, Video, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AslToEnglishGateway() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTranslate = async () => {
    setIsLoading(true);
    setTranslatedText(null);

    try {
      // Placeholder for actual video capture. In a real app, you'd get this from the VideoFeed component.
      // Using a minimal transparent GIF data URI as a placeholder.
      const videoDataUri = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      
      const result = await aslToText({ videoDataUri });
      setTranslatedText(result.englishText);
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Translation Error',
        description: 'Failed to translate ASL video. Please try again with a valid video.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSpeak = () => {
    if (translatedText && typeof window !== 'undefined' && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(translatedText);
        window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-6 w-6 text-primary" />
          ASL to English
        </CardTitle>
        <CardDescription>
          Translate a video of American Sign Language into English text. Your camera feed is shown below.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <VideoFeed />
        <Button onClick={handleTranslate} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Video className="mr-2 h-4 w-4" />
          )}
          Translate from Video
        </Button>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h3 className="text-sm font-semibold mb-2 text-card-foreground">Translated English Text</h3>
          <div className="w-full min-h-[8rem] rounded-lg border border-dashed p-4 flex flex-col justify-center bg-muted/40">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Translating Video...</p>
              </div>
            ) : translatedText ? (
                <div className="flex items-start justify-between gap-4">
                    <p className="text-lg flex-grow text-card-foreground">{translatedText}</p>
                    <Button variant="outline" size="icon" onClick={handleSpeak} aria-label="Speak translated text">
                        <Volume2 className="h-5 w-5" />
                    </Button>
                </div>
            ) : (
              <p className="text-muted-foreground text-center">
                The translated text will appear here.
              </p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
