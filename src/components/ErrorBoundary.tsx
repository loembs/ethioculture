// =============================================
// ERROR BOUNDARY - Gestion Globale des Erreurs
// =============================================
// Capture toutes les erreurs React et affiche la page de maintenance

import React, { Component, ErrorInfo, ReactNode } from 'react';
import MaintenancePage from '@/pages/MaintenancePage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorCount: 0
  };

  public static getDerivedStateFromError(_: Error): State {
    return { 
      hasError: true,
      errorCount: 0
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur (seulement en dev)
    if (import.meta.env.DEV) {
      console.error('Erreur capturée:', error, errorInfo);
    }

    // Incrémenter le compteur d'erreurs
    const count = this.state.errorCount + 1;
    this.setState({ errorCount: count });

    // Si trop d'erreurs, vider le cache
    if (count > 3) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Ignorer
      }
    }

    // Logger l'erreur (sans détails sensibles) pour analytics
    try {
      // Ici vous pourriez envoyer à un service comme Sentry
      const errorReport = {
        message: error.message,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      // En production, envoyer à votre service d'analytics
      if (import.meta.env.PROD) {
        // fetch('/api/log-error', { method: 'POST', body: JSON.stringify(errorReport) });
      }
    } catch (e) {
      // Ignorer les erreurs de logging
    }
  }

  public render() {
    if (this.state.hasError) {
      return <MaintenancePage type="error" />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

