// =============================================
// COMPOSANT DE DEBUG SUPABASE
// =============================================
// À utiliser temporairement pour diagnostiquer

import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const SupabaseDebug = () => {
  const [status, setStatus] = useState<any>({
    envVars: false,
    connection: false,
    products: 0,
    artists: 0,
    error: null
  });

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // 1. Vérifier les variables d'environnement
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        console.log('🔍 Variables env:', {
          url: supabaseUrl,
          keyPresent: !!supabaseKey,
          keyLength: supabaseKey?.length
        });

        setStatus(prev => ({
          ...prev,
          envVars: !!(supabaseUrl && supabaseKey)
        }));

        // 2. Test de connexion simple
        const { data: testData, error: testError } = await supabase
          .from('ethio_products')
          .select('id')
          .limit(1);

        console.log('🔍 Test connexion:', { testData, testError });
        console.error('📢 ERREUR COMPLÈTE:', testError);

        if (testError) {
          setStatus(prev => ({ 
            ...prev, 
            error: `${testError.message} (Code: ${testError.code})` 
          }));
          return;
        }

        setStatus(prev => ({ ...prev, connection: true }));

        // 3. Compter les produits
        const { count: productsCount } = await supabase
          .from('ethio_products')
          .select('*', { count: 'exact', head: true });

        // 4. Compter les artistes
        const { count: artistsCount } = await supabase
          .from('artists')
          .select('*', { count: 'exact', head: true });

        console.log('🔍 Comptage:', { productsCount, artistsCount });

        setStatus(prev => ({
          ...prev,
          products: productsCount || 0,
          artists: artistsCount || 0
        }));

        // 5. Test d'authentification
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔍 Session:', !!session);

      } catch (error: any) {
        console.error('❌ Erreur debug:', error);
        setStatus(prev => ({ ...prev, error: error.message }));
      }
    };

    checkSupabase();
  }, []);

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">🔧 Debug Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Variables env:</span>
          <Badge variant={status.envVars ? 'default' : 'destructive'}>
            {status.envVars ? '✅ OK' : '❌ Manquantes'}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span>Connexion:</span>
          <Badge variant={status.connection ? 'default' : 'destructive'}>
            {status.connection ? '✅ OK' : '❌ Échec'}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span>Produits:</span>
          <Badge variant={status.products > 0 ? 'default' : 'secondary'}>
            {status.products}
          </Badge>
        </div>
        
        <div className="flex justify-between">
          <span>Artistes:</span>
          <Badge variant={status.artists > 0 ? 'default' : 'secondary'}>
            {status.artists}
          </Badge>
        </div>

        {status.error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded max-h-32 overflow-auto">
            <p className="text-red-600 text-xs font-mono">{status.error}</p>
            <p className="text-xs text-gray-600 mt-1">
              💡 Ouvrez <code>INSTRUCTIONS_FIX_DONNEES.md</code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

