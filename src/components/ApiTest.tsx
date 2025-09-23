import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiService } from '@/services/api';

interface ApiTestResult {
  endpoint: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  data?: any;
}

export const ApiTest = () => {
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const testEndpoints = [
    { name: 'Produits', endpoint: '/products' },
    { name: 'Produits en vedette', endpoint: '/products/featured' },
    { name: 'Statistiques Admin', endpoint: '/admin/statistics' },
  ];

  const testApiConnection = async () => {
    setIsTesting(true);
    setResults([]);

    for (const test of testEndpoints) {
      setResults(prev => [...prev, {
        endpoint: test.name,
        status: 'loading',
        message: 'Test en cours...'
      }]);

      try {
        const response = await apiService.get(test.endpoint);
        setResults(prev => prev.map(r => 
          r.endpoint === test.name 
            ? { 
                endpoint: test.name, 
                status: 'success' as const, 
                message: 'Connexion réussie', 
                data: response 
              }
            : r
        ));
      } catch (error) {
        setResults(prev => prev.map(r => 
          r.endpoint === test.name 
            ? { 
                endpoint: test.name, 
                status: 'error' as const, 
                message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
              }
            : r
        ));
      }
    }

    setIsTesting(false);
  };

  const getStatusIcon = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Test en cours</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Test de Connexion API
          <Badge variant="outline">Backend</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Testez la connexion entre le frontend et le backend Geezaback
        </div>
        
        <Button 
          onClick={testApiConnection} 
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Test en cours...
            </>
          ) : (
            'Tester la connexion API'
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Résultats des tests :</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.endpoint}</div>
                    <div className="text-sm text-muted-foreground">{result.message}</div>
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          <p><strong>URL de l'API :</strong> {import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}</p>
          <p><strong>Environnement :</strong> {import.meta.env.VITE_APP_ENV || 'development'}</p>
        </div>
      </CardContent>
    </Card>
  );
};





