import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Mic, MicOff, Video, VideoOff } from 'lucide-react';

export default function Studio() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const requestPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 },
        audio: true,
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Failed to access camera and microphone. Please grant permissions.');
      console.error('Error accessing media devices:', err);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="min-h-screen bg-[#0D0F1A] text-[#F5F5F7] p-8 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,107,107,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#FF6B6B]">pulse</span> Studio
          </h1>
          <p className="text-[#A0A3B1]">Professional live stream effects, running in your browser.</p>
        </div>

        {!hasPermission ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <Card className="bg-[#1A1D29] border-[#3A3D4A] p-12 text-center max-w-lg">
              <div className="mb-6">
                <Camera className="w-16 h-16 mx-auto text-[#FF6B6B] mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-[#F5F5F7]">Enable Camera & Microphone</h2>
                <p className="text-[#A0A3B1] mb-6">
                  Click below to grant access to your camera and microphone to start streaming.
                </p>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>
              <Button 
                onClick={requestPermissions}
                size="lg"
                className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white"
              >
                <Camera className="w-5 h-5 mr-2" />
                Enable Camera
              </Button>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Preview */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1A1D29] border-[#3A3D4A] p-4">
                <div className="aspect-video bg-[#0D0F1A] rounded-lg overflow-hidden relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                    <Button
                      onClick={toggleAudio}
                      size="lg"
                      variant={audioEnabled ? "default" : "destructive"}
                      className={audioEnabled ? "rounded-full w-14 h-14 bg-[#3A3D4A] hover:bg-[#4A4D5A]" : "rounded-full w-14 h-14"}
                    >
                      {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                    <Button
                      onClick={toggleVideo}
                      size="lg"
                      variant={videoEnabled ? "default" : "destructive"}
                      className={videoEnabled ? "rounded-full w-14 h-14 bg-[#3A3D4A] hover:bg-[#4A4D5A]" : "rounded-full w-14 h-14"}
                    >
                      {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Effects Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-[#1A1D29] border-[#3A3D4A] p-4">
                <h3 className="text-xl font-bold mb-4 text-[#F5F5F7]">Effects</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[#0D0F1A] border border-[#3A3D4A] rounded-lg opacity-50 cursor-not-allowed">
                    <p className="font-medium text-[#F5F5F7]">Background Blur</p>
                    <p className="text-sm text-[#A0A3B1]">Coming soon</p>
                  </div>
                  <div className="p-3 bg-[#0D0F1A] border border-[#3A3D4A] rounded-lg opacity-50 cursor-not-allowed">
                    <p className="font-medium text-[#F5F5F7]">Background Remove</p>
                    <p className="text-sm text-[#A0A3B1]">Coming soon</p>
                  </div>
                  <div className="p-3 bg-[#0D0F1A] border border-[#3A3D4A] rounded-lg opacity-50 cursor-not-allowed">
                    <p className="font-medium text-[#F5F5F7]">Color Correction</p>
                    <p className="text-sm text-[#A0A3B1]">Coming soon</p>
                  </div>
                  <div className="p-3 bg-[#0D0F1A] border border-[#3A3D4A] rounded-lg opacity-50 cursor-not-allowed">
                    <p className="font-medium text-[#F5F5F7]">Face Tracking</p>
                    <p className="text-sm text-[#A0A3B1]">Coming soon</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
