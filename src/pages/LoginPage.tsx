import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Chrome, Palette, Utensils, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services";
import { SecurityValidator } from "@/utils/validation";

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP States
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpSending, setOtpSending] = useState(false);
  
  // Reset Password States
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  
  // Récupérer l'URL de redirection (par défaut: profil)
  const redirectUrl = searchParams.get('redirect') || '/profile';
  
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

  // Envoyer le code OTP
  const handleSendOTP = async () => {
    if (!otpEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre email",
        variant: "destructive"
      });
      return;
    }

    setOtpSending(true);
    try {
      const result = await authService.sendOTP(otpEmail);
      
      toast({
        title: "Code envoyé !",
        description: "Vérifiez votre boîte email (et vos spams)"
      });
      
      setShowOTPForm(true);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code",
        variant: "destructive"
      });
    } finally {
      setOtpSending(false);
    }
  };

  // Gérer la saisie du code OTP
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOTP = [...otpCode];
    newOTP[index] = value;
    setOtpCode(newOTP);

    // Auto-focus sur le prochain champ
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Vérifier le code OTP
  const handleVerifyOTP = async () => {
    const code = otpCode.join('');
    
    if (code.length !== 4) {
      toast({
        title: "Code incomplet",
        description: "Veuillez entrer les 4 chiffres",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyOTP(otpEmail, code);
      
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur Geezaculture"
      });
      
      navigate(redirectUrl, { replace: true });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Code invalide ou expiré",
        variant: "destructive"
      });
      setOtpCode(['', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.login({
        email: loginForm.email,
        password: loginForm.password
      });
      
        toast({
          title: "Connexion réussie",
        description: "Bienvenue sur Geezaculture !"
      });
      
      navigate(redirectUrl, { replace: true });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const sanitizedData = SecurityValidator.sanitizeRegistrationData({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        address: registerForm.address
      });

      await authService.register(sanitizedData);
      
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue sur Geezaculture !"
      });
      
      navigate(redirectUrl, { replace: true });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      toast({
        title: "Erreur d'inscription",
        description: "Impossible de créer le compte",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion avec Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await authService.signInWithGoogle();
      
      toast({
        title: "Redirection vers Google",
        description: "Veuillez patienter..."
      });
    } catch (error: any) {
      console.error('Erreur Google Sign In:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de se connecter avec Google",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Envoyer l'email de réinitialisation
  const handleSendResetEmail = async () => {
    if (!resetEmail) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendPasswordResetEmail(resetEmail);
      
      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte email pour réinitialiser votre mot de passe"
      });
      
      setShowResetPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Côté gauche - Simple et vert */}
      <div className="hidden lg:flex lg:w-2/5 bg-ethiopian-green items-center justify-center p-12">
        <div className="text-center text-white space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-4">Geezaculture</h1>
            <p className="text-xl text-white/90">Art et saveurs d'Éthiopie</p>
          </div>
          
          <div className="space-y-4 max-w-sm mx-auto mt-12">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Palette className="h-5 w-5" />
              </div>
              <span className="text-sm">Œuvres d'art authentiques</span>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Utensils className="h-5 w-5" />
              </div>
              <span className="text-sm">Cuisine traditionnelle</span>
            </div>
            
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-sm">Livraison rapide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Côté droit - Formulaire blanc */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* En-tête mobile */}
          <div className="lg:hidden mb-8">
            <div className="w-12 h-12 rounded-xl bg-ethiopian-green flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">G</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Geezaculture
            </h1>
            <p className="text-sm text-gray-600 mb-4">Art et saveurs d'Éthiopie</p>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              size="sm"
              className="text-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          {/* Bouton retour desktop */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-8 hidden lg:flex text-gray-600"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Connexion
            </h2>
            <p className="text-gray-600">
              Accédez à votre compte
            </p>
          </div>

          <div className="space-y-6">
            {/* Formulaire de réinitialisation de mot de passe */}
            {showResetPassword ? (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Mot de passe oublié ?</h3>
                  <p className="text-sm text-gray-600">
                    Recevez un lien par email
                  </p>
                </div>

                <div>
                  <Label htmlFor="reset-email" className="text-gray-700">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="votre@email.com"
                    className="mt-1.5"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendResetEmail()}
                  />
                </div>
                
                <Button
                  className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90"
                  onClick={handleSendResetEmail}
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi...' : 'Envoyer'}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-gray-600"
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetEmail('');
                  }}
                >
                  Retour
                </Button>
              </div>
            ) : /* Formulaire classique */
            (
              <>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Connexion</TabsTrigger>
                    <TabsTrigger value="register">Inscription</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email" className="text-gray-700">Email</Label>
                        <Input 
                          id="login-email"
                          type="email" 
                          placeholder="votre@email.com"
                          className="mt-1.5"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="login-password" className="text-gray-700">Mot de passe</Label>
                        <div className="relative">
                          <Input 
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="mt-1.5 pr-10"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="remember"
                            checked={loginForm.rememberMe}
                            onCheckedChange={(checked) => 
                              setLoginForm({ ...loginForm, rememberMe: checked as boolean })
                            }
                          />
                          <label htmlFor="remember" className="text-gray-700">
                            Se souvenir
                          </label>
                        </div>
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-ethiopian-green hover:text-ethiopian-green/80"
                          onClick={() => setShowResetPassword(true)}
                        >
                          Mot de passe oublié ?
                        </Button>
                      </div>
                      
                      <Button type="submit" className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90" disabled={isLoading}>
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                      </Button>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white px-2 text-gray-500">ou</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        <Chrome className="h-4 w-4 mr-2" />
                        Continuer avec Google
                      </Button>
                    </form>
                  </TabsContent>
              
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-700">Prénom</Label>
                          <Input 
                            id="firstName" 
                            placeholder="Prénom"
                            className="mt-1.5"
                            value={registerForm.firstName}
                            onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-700">Nom</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Nom"
                            className="mt-1.5"
                            value={registerForm.lastName}
                            onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                            required 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="register-email" className="text-gray-700">Email</Label>
                        <Input 
                          id="register-email"
                          type="email"
                          placeholder="votre@email.com"
                          className="mt-1.5"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="register-password" className="text-gray-700">Mot de passe</Label>
                        <Input 
                          id="register-password"
                          type="password"
                          placeholder="6 caractères minimum"
                          className="mt-1.5"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          required
                          minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Au moins 6 caractères
                        </p>
                      </div>
                      
                      <Button type="submit" className="w-full bg-ethiopian-green hover:bg-ethiopian-green/90" disabled={isLoading}>
                        {isLoading ? 'Inscription...' : "Créer mon compte"}
                      </Button>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white px-2 text-gray-500">ou</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                      >
                        <Chrome className="h-4 w-4 mr-2" />
                        Continuer avec Google
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
