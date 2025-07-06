
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Target, HandHeart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About SignSpeak</h1>
          <p className="text-xl text-muted-foreground">
            Breaking barriers and building bridges through the power of communication.
          </p>
        </div>

        <div className="mt-16">
          <Image
            src="https://placehold.co/1200x500.png"
            width={1200}
            height={500}
            alt="Team working together"
            className="rounded-lg object-cover"
            data-ai-hint="team collaboration"
          />
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <Target className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground">
              Our mission is to create a more inclusive world by eliminating communication barriers between the deaf and hearing communities. We leverage cutting-edge technology to provide seamless, real-time translation, making conversations accessible to everyone, everywhere.
            </p>
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <HandHeart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Our Vision</h2>
            </div>
            <p className="text-muted-foreground">
              We envision a future where language differences no longer hinder connection and understanding. SignSpeak aims to be the go-to platform for effortless communication, empowering individuals and fostering a global community built on empathy and shared experiences.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold">Meet the Team</h2>
          <p className="mt-2 text-muted-foreground">The passionate minds behind SignSpeak</p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {['Alice', 'Bob', 'Charlie', 'Dana'].map((name) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`https://placehold.co/100x100.png`} data-ai-hint="person portrait" />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">Developer</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
