import { useState, useEffect } from 'react';
import { X, Menu, Palette, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';

interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  icon: any;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const OnboardingTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 'menu',
      target: '.mobile-menu-button',
      title: 'Menu de navigation',
      description: 'Cliquez ici pour accéder à toutes les sections du site',
      icon: Menu,
      position: 'bottom'
    },
    {
      id: 'art',
      target: '[href="/art"]',
      title: 'Art & Culture',
      description: 'Découvrez nos artistes et leurs œuvres d\'art',
      icon: Palette,
      position: 'bottom'
    },
    {
      id: 'cuisine',
      target: '[href="/cuisine"]',
      title: 'Cuisine Éthiopienne',
      description: 'Explorez nos délicieux plats traditionnels',
      icon: ShoppingBag,
      position: 'bottom'
    }
  ];

  useEffect(() => {
    // Vérifier si c'est un appareil mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Vérifier si le tour a déjà été vu
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour');
    
    if (!hasSeenTour) {
      // Attendre un peu avant d'afficher le tour
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkMobile);
      };
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Auto-progression du tour
      if (currentStep < tourSteps.length - 1) {
        const timer = setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 4000); // 4 secondes par étape

        return () => clearTimeout(timer);
      } else {
        // Fermer automatiquement après la dernière étape
        const timer = setTimeout(() => {
          closeTour();
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, isVisible]);

  const closeTour = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenOnboardingTour', 'true');
  };

  const skipTour = () => {
    closeTour();
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];
  const Icon = currentTourStep.icon;

  // Calculer la position du tooltip
  const getTooltipPosition = () => {
    const target = document.querySelector(currentTourStep.target);
    if (!target) return { top: '50%', left: '50%' };

    const rect = target.getBoundingClientRect();
    
    switch (currentTourStep.position) {
      case 'bottom':
        return {
          top: `${rect.bottom + 15}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'top':
        return {
          top: `${rect.top - 15}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 15}px`,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 15}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return { top: '50%', left: '50%' };
    }
  };

  return (
    <>
      {/* Overlay semi-transparent */}
      <div 
        className="fixed inset-0 bg-black/40 z-[100] animate-fade-in"
        onClick={closeTour}
      />

      {/* Spotlight sur l'élément ciblé */}
      <div className="fixed inset-0 z-[101] pointer-events-none">
        {tourSteps.map((step, index) => {
          const target = document.querySelector(step.target);
          if (!target || index !== currentStep) return null;
          
          const rect = target.getBoundingClientRect();
          
          return (
            <div
              key={step.id}
              className="absolute animate-pulse"
              style={{
                top: `${rect.top - 5}px`,
                left: `${rect.left - 5}px`,
                width: `${rect.width + 10}px`,
                height: `${rect.height + 10}px`,
                border: '3px solid #e4912b',
                borderRadius: '12px',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
                pointerEvents: 'none'
              }}
            />
          );
        })}
      </div>

      {/* Tooltip avec les instructions */}
      <div
        className="fixed z-[102] animate-fade-in-up"
        style={getTooltipPosition()}
      >
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm border-2 border-ethiopian-gold">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ethiopian-gold/20 flex items-center justify-center">
                <Icon className="h-5 w-5 text-ethiopian-gold" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{currentTourStep.title}</h3>
                <p className="text-xs text-gray-500">
                  Étape {currentStep + 1} sur {tourSteps.length}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeTour}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4">
            {currentTourStep.description}
          </p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-ethiopian-gold' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-gray-600 hover:text-gray-900"
            >
              Passer
            </Button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Précédent
                </Button>
              )}
              {currentStep < tourSteps.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-ethiopian-gold hover:bg-ethiopian-gold/90 text-black"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={closeTour}
                  className="bg-ethiopian-gold hover:bg-ethiopian-gold/90 text-black"
                >
                  Terminer
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Flèche pointant vers l'élément */}
        <div
          className={`absolute w-0 h-0 border-8 ${
            currentTourStep.position === 'bottom'
              ? 'border-b-white border-x-transparent border-t-transparent -top-4 left-1/2 -translate-x-1/2'
              : currentTourStep.position === 'top'
              ? 'border-t-white border-x-transparent border-b-transparent -bottom-4 left-1/2 -translate-x-1/2'
              : currentTourStep.position === 'left'
              ? 'border-l-white border-y-transparent border-r-transparent -right-4 top-1/2 -translate-y-1/2'
              : 'border-r-white border-y-transparent border-l-transparent -left-4 top-1/2 -translate-y-1/2'
          }`}
        />
      </div>
    </>
  );
};

