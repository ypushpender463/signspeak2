'use client';

import { useEffect, useState, RefObject } from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface VideoFeedProps {
    videoRef: RefObject<HTMLVideoElement>;
}

export function VideoFeed({ videoRef }: VideoFeedProps) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const enableCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia is not supported in this browser.');
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraOn(true);
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err instanceof Error) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setError("Camera access was denied. Please allow camera access in your browser settings.");
            } else {
                setError("Could not access camera. Please check permissions and ensure it's not in use by another app.");
            }
        } else {
            setError("An unknown error occurred while accessing the camera.");
        }
        setIsCameraOn(false);
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoRef]);

  return (
    <div className="w-full aspect-video rounded-lg bg-card border overflow-hidden relative flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Live camera feed"
      />
      <div className={`absolute inset-0 flex flex-col items-center justify-center bg-secondary/50 text-muted-foreground p-4 text-center transition-opacity ${isCameraOn ? 'opacity-0' : 'opacity-100'}`}>
        {error ? (
          <>
            <CameraOff className="h-10 w-10 mb-2" />
            <p className="font-semibold text-destructive">Camera Error</p>
            <p className="text-sm">{error}</p>
          </>
        ) : (
          <>
            <Camera className="h-10 w-10 mb-2 animate-pulse" />
            <p>Starting camera...</p>
          </>
        )}
      </div>
    </div>
  );
}
