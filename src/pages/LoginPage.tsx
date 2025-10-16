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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ethiopian-green/10 via-background to-ethiopian-gold/10 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Button>

        <Card className="shadow-2xl border-ethiopian-gold/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-ethiopian-green to-ethiopian-gold bg-clip-text text-transparent">
              🌍 Geezaculture
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Découvrez l'art et les saveurs de l'Éthiopie
            </p>
          </CardHeader>

          <CardContent>
            {/* Formulaire OTP */}
            {!showOTPForm ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp-email">Email</Label>
                  <Input
                    id="otp-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                  />
                </div>
                
                <Button
                  className="w-full ethiopian-button"
                  onClick={handleSendOTP}
                  disabled={otpSending}
                >
                  {otpSending ? 'Envoi...' : 'Recevoir un code par email'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Code envoyé à <strong>{otpEmail}</strong>
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowOTPForm(false);
                      setOtpCode(['', '', '', '']);
                    }}
                  >
                    Modifier l'email
                  </Button>
                </div>

                <div>
                  <Label className="text-center block mb-3">
                    Entrez le code à 4 chiffres
                  </Label>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3].map((index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-14 h-14 text-center text-2xl font-bold"
                        value={otpCode[index]}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full ethiopian-button"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otpCode.join('').length !== 4}
                >
                  {isLoading ? 'Vérification...' : 'Vérifier'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleSendOTP}
                  disabled={otpSending}
                >
                  Renvoyer le code
                </Button>
              </div>
            )}

            <Separator className="my-6" />

            {/* Connexion classique (repliable) */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full ethiopian-button" disabled={isLoading}>
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        placeholder="Prénom"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        placeholder="Nom"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-password">Mot de passe</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full ethiopian-button" disabled={isLoading}>
                    {isLoading ? 'Inscription...' : "S'inscrire"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
