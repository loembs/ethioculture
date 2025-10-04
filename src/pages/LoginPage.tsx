import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { SecurityValidator } from "@/utils/validation";

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Récupérer l'URL de redirection
  const redirectUrl = searchParams.get('redirect') || '/';
  
  // États pour le formulaire de connexion
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // États pour le formulaire d'inscription
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    agreeTerms: false
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Debug: afficher les données envoyées
      console.log('Tentative de connexion avec:', {
        email: loginForm.email,
        password: loginForm.password ? '***' : 'vide'
      });
      
      // Appel à l'API de connexion
      await authService.login({
        email: loginForm.email,
        password: loginForm.password
      });
      
      // Vérifier si l'utilisateur est un administrateur
      const user = authService.getUser();
      if (user && user.role === 'ADMIN') {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'espace administrateur !"
        });
        // Rediriger vers le dashboard admin
        navigate('/admin', { replace: true });
      } else {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur EthioTaste & Art !"
        });
        // Rediriger vers l'URL demandée ou l'accueil
        navigate(redirectUrl, { replace: true });
      }
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      // Gestion spécifique des erreurs réseau
      let errorMessage = "Email ou mot de passe incorrect";
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('ERR_HTTP2_PING_FAILED') ||
            error.message.includes('ERR_NETWORK')) {
          errorMessage = "Serveur temporairement indisponible. Veuillez réessayer dans quelques minutes.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "La connexion a pris trop de temps. Veuillez réessayer.";
        }
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation sécurisée des données
    const validation = SecurityValidator.validateRegistration({
      email: registerForm.email,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      phone: registerForm.phone,
      address: registerForm.address
    });

    if (!validation.isValid) {
      toast({
        title: "Erreur de validation",
        description: validation.errors[0],
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    if (!registerForm.agreeTerms) {
      toast({
        title: "Erreur de validation",
        description: "Vous devez accepter les conditions d'utilisation",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Nettoyer et sécuriser les données avant envoi
      const sanitizedData = SecurityValidator.sanitizeRegistrationData({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        address: registerForm.address
      });

      // Appel à l'API d'inscription
      await authService.register(sanitizedData);
      
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue dans la communauté EthioTaste & Art !"
      });
      
      // Rediriger vers l'URL demandée ou l'accueil
      navigate(redirectUrl, { replace: true });
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      // Gestion spécifique des erreurs réseau
      let errorMessage = "Impossible de créer le compte. Veuillez réessayer.";
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('ERR_HTTP2_PING_FAILED') ||
            error.message.includes('ERR_NETWORK')) {
          errorMessage = "Serveur temporairement indisponible. Veuillez réessayer dans quelques minutes.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "La requête a pris trop de temps. Veuillez réessayer.";
        }
      }
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f3f4f6%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-gray-600 mb-6 hover:text-ethiopian-gold transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Link>
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mb-6">
              <img 
                src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758210753/Geeza_Logo_lwpeuv.png" 
                alt="Geeza Culture Logo" 
                className="h-12 w-auto mx-auto mb-4" 
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue</h1>
              <p className="text-gray-600">Accédez à votre compte ou créez-en un nouveau</p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="login" 
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Inscription
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="votre@email.com"
                        className="pl-10"
                        required 
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        className="pl-10 pr-10"
                        required 
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm">Se souvenir de moi</Label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Mot de passe oublié ?
                    </a>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-ethiopian-gold hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                  
                  {/* Bouton de test pour le développement */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-gray-200 hover:bg-gray-50 rounded-xl"
                    onClick={() => {
                      setLoginForm({
                        email: 'test@ethioculture.com',
                        password: 'password123',
                        rememberMe: false
                      });
                    }}
                  >
                    Remplir avec compte test
                  </Button>
                </form>
                
                <div className="relative">
                  <Separator className="my-4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-2 text-xs text-muted-foreground">OU</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 rounded-xl" type="button">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuer avec Google
                  </Button>
                  
                  <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 rounded-xl" type="button">
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continuer avec Facebook
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Prénom" 
                        required 
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Nom" 
                        required 
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="registerEmail" 
                        type="email" 
                        placeholder="votre@email.com"
                        className="pl-10"
                        required 
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone (optionnel)</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="0123456789"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse (optionnelle)</Label>
                    <Input 
                      id="address" 
                      placeholder="Votre adresse complète"
                      value={registerForm.address}
                      onChange={(e) => setRegisterForm({...registerForm, address: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="registerPassword" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Choisir un mot de passe"
                        className="pl-10 pr-10"
                        required 
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        className="pl-10"
                        required 
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={registerForm.agreeTerms}
                      onCheckedChange={(checked) => setRegisterForm({...registerForm, agreeTerms: !!checked})}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      J'accepte les{" "}
                      <a href="#" className="text-primary hover:underline">
                        conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a href="#" className="text-primary hover:underline">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-ethiopian-gold hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Création du compte..." : "Créer mon compte"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;