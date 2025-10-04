import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';

interface NetworkErrorBannerProps {
  error?: Error | null;
  onRetry?: () => void;
}

export const NetworkErrorBanner = ({ error, onRetry }: NetworkErrorBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error && (
      error.message.includes('Failed to fetch') ||
      error.message.includes('ERR_HTTP2_PING_FAILED') ||
      error.message.includes('ERR_NETWORK') ||
      error.message.includes('timeout')
    )) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [error]);

  if (!isVisible) return null;

  return (
    <Alert className="border-red-200 bg-red-50 text-red-800">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Problème de connexion</strong>
          <p className="text-sm mt-1">
            Le serveur est temporairement indisponible. Veuillez réessayer dans quelques minutes.
          </p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4 border-red-300 text-red-800 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
