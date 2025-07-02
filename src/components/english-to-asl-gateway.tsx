'use client';

import { useState } from 'react';
import { textToAsl } from '@/ai/flows/text-to-asl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Languages } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function EnglishToAslGateway() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aslAnimation, setAslAnimation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setAslAnimation(null);
    setError(null);

    try {
      const result = await textToAsl({ englishText: inputText });
      setAslAnimation(result.aslAnimationData);
    } catch (err) {
      setError('Failed to generate ASL animation. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Manually find and submit the form
      const form = (e.target as HTMLElement).closest('form');
      form?.requestSubmit();
    }
  };

  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-6 w-6 text-primary" />
          English to ASL
        </CardTitle>
        <CardDescription>
          Type your English text below to convert it into an ASL animation.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleFormSubmit} className="flex flex-col flex-grow">
        <CardContent className="flex-grow space-y-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="english-text">English Text</Label>
              <Textarea
                id="english-text"
                placeholder="e.g., Hello, how are you?"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                disabled={isLoading}
                aria-label="English text to translate to ASL"
              />
              <p className="text-sm text-muted-foreground">
                Press{' '}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  Enter
                </kbd>{' '}
                to translate.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !inputText.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Translate to ASL
            </Button>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <h3 className="text-sm font-semibold mb-2 text-card-foreground">ASL Animation Output</h3>
            <div className="w-full h-64 rounded-lg border border-dashed flex items-center justify-center bg-muted/40 p-4">
              {isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p>Generating Animation...</p>
                  </div>
              ) : aslAnimation ? (
                <div className="text-center w-full">
                  <p className="text-sm text-muted-foreground">Animation data received. Renderer component would visualize this.</p>
                  <pre className="mt-2 text-xs text-left bg-background rounded-md p-2 max-h-40 overflow-auto w-full">
                      <code>{JSON.stringify(JSON.parse(aslAnimation), null, 2)}</code>
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground text-center px-4">
                  The generated ASL animation will be displayed here.
                </p>
              )}
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
