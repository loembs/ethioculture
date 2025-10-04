import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArtVideoBannerProps {
  videoSrc: string;
  title: string;
  subtitle: string;
  overlayGradient?: string;
  className?: string;
}

export const ArtVideoBanner: React.FC<ArtVideoBannerProps> = ({
  videoSrc,
  title,
  subtitle,
  overlayGradient = "linear-gradient(45deg, rgba(218, 2, 14, 0.7), rgba(15, 71, 175, 0.7))",
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      const handleError = () => {
        setIsLoading(false);
        toast({
          title: "Erreur de chargement vidéo",
          description: "Impossible de charger la vidéo. Vérifiez votre connexion.",
          variant: "destructive"
        });
      };

      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isMuted, toast]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!video.muted);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (!document.fullscreenElement) {
        video.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className={`video-container ${className}`}>
      {/* Vidéo de fond */}
      <video
        ref={videoRef}
        className="video-background"
        autoPlay
        muted
        loop
        playsInline
        poster="/api/placeholder/1920/1080"
      >
        <source src={videoSrc} type="video/mp4" />
        <source src="/public/Loumo10.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>

      {/* Overlay avec gradient */}
      <div 
        className="video-overlay"
        style={{ background: overlayGradient }}
      >
        {/* Contrôles vidéo */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="bg-black/20 hover:bg-black/40 text-white border-white/20"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="bg-black/20 hover:bg-black/40 text-white border-white/20"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-black/20 hover:bg-black/40 text-white border-white/20"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Indicateur de chargement */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto px-4 text-center animate-cultural-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 ethiopian-text-shadow">
            <span className="ethiopian-text-gradient">{title}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="ethiopian-button animate-ethiopian-pulse"
              onClick={() => document.getElementById('art-collection')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Découvrir l'Art
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 animate-spice-float"
              onClick={() => document.getElementById('art-events')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Nos Événements
            </Button>
          </div>
        </div>

        {/* Éléments décoratifs flottants */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-spice-gold rounded-full animate-spice-float opacity-60"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-ethiopian-yellow rounded-full animate-spice-float opacity-40 animate-delay-200"></div>
          <div className="absolute bottom-32 left-20 w-3 h-3 bg-spice-saffron rounded-full animate-spice-float opacity-50 animate-delay-300"></div>
          <div className="absolute bottom-20 right-32 w-5 h-5 bg-ethiopian-red rounded-full animate-spice-float opacity-30 animate-delay-400"></div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
