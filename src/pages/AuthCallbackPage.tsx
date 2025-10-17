// =============================================
// PAGE DE CALLBACK OAUTH (Google, etc.)
// =============================================
// Cette page gère le retour après connexion OAuth

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/config/supabase';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Finalisation de la connexion...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Récupérer la session après le callback OAuth
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erreur callback OAuth:', error);
        setStatus('error');
        setMessage('Erreur lors de la connexion');
        
        // Rediriger vers login après 3 secondes
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
        return;
      }

      if (session) {
        console.log('✅ Session OAuth créée:', session.user.email);
        setStatus('success');
        setMessage('Connexion réussie !');
        
        // Attendre un peu pour que l'utilisateur voie le message
        setTimeout(() => {
          // Récupérer l'URL de redirection depuis les paramètres (si définie)
          const redirectUrl = searchParams.get('redirect') || '/';
          navigate(redirectUrl, { replace: true });
        }, 1500);
      } else {
        // Pas de session, rediriger vers login
        console.warn('⚠️ Pas de session après callback OAuth');
        setStatus('error');
        setMessage('Aucune session trouvée');
        
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur inattendue callback:', error);
      setStatus('error');
      setMessage('Une erreur est survenue');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6 max-w-md px-4">
        {/* Logo/Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-ethiopian-green/10 flex items-center justify-center">
          {status === 'loading' && (
            <Loader2 className="h-8 w-8 text-ethiopian-green animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          )}
          {status === 'error' && (
            <AlertCircle className="h-8 w-8 text-red-500" />
          )}
        </div>

        {/* Message */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {status === 'loading' && 'Connexion en cours...'}
            {status === 'success' && 'Connexion réussie !'}
            {status === 'error' && 'Erreur de connexion'}
          </h2>
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        {/* Barre de progression */}
        {status === 'loading' && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-ethiopian-green h-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        )}

        {/* Redirection info */}
        {status === 'success' && (
          <p className="text-sm text-gray-500">
            Redirection vers la page d'accueil...
          </p>
        )}

        {status === 'error' && (
          <p className="text-sm text-gray-500">
            Redirection vers la page de connexion...
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;

