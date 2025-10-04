import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { 
  Instagram, 
  Video,
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ArrowRight,
  UserPlus,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();
  
  // ===== ÉTATS POUR LE FORMULAIRE D'INSCRIPTION ADMIN =====
  
  // État contenant les données du formulaire
  const [adminForm, setAdminForm] = useState({
    firstName: '',       // Prénom de l'administrateur
    lastName: '',        // Nom de l'administrateur
    email: '',           // Email unique pour la connexion
    password: '',        // Mot de passe (sera hashé côté serveur)
    confirmPassword: ''  // Confirmation du mot de passe
  });
  
  // États pour l'affichage/masquage des mots de passe
  const [showPassword, setShowPassword] = useState(false);           // Afficher/masquer le mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Afficher/masquer la confirmation
  
  // État pour gérer l'affichage du formulaire (plié/déplié)
  const [showAdminForm, setShowAdminForm] = useState(false);
  
  // État pour gérer le chargement lors de la soumission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== FONCTION DE SOUMISSION DU FORMULAIRE ADMIN =====
  
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    // ===== VALIDATIONS CLIENT-SIDE =====
    
    // Vérification que tous les champs obligatoires sont remplis
    if (!adminForm.firstName || !adminForm.lastName || !adminForm.email || !adminForm.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    // Vérification que les mots de passe correspondent
    if (adminForm.password !== adminForm.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    // Vérification de la longueur minimale du mot de passe
    if (adminForm.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive"
      });
      return;
    }

    // ===== SOUMISSION À L'API =====
    
    setIsSubmitting(true); // Active l'état de chargement
    
    try {
      // Appel à l'API pour créer l'administrateur
      // Le mot de passe sera automatiquement hashé côté serveur
      const response = await authService.registerAdmin({
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        password: adminForm.password,
        role: 'ADMIN' // Rôle fixé à ADMIN
      });

      // ===== GESTION DU SUCCÈS =====
      
      if (response.success) {
        // Notification de succès
        toast({
          title: "Succès",
          description: "Administrateur créé avec succès",
        });
        
        // Réinitialisation du formulaire
        setAdminForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Masquage du formulaire
        setShowAdminForm(false);
      } else {
        // Erreur retournée par l'API
        throw new Error(response.message || 'Erreur lors de la création');
      }
    } catch (error: any) {
      // ===== GESTION DES ERREURS =====
      
      // Affichage du message d'erreur à l'utilisateur
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'administrateur",
        variant: "destructive"
      });
    } finally {
      // ===== NETTOYAGE =====
      
      // Désactivation de l'état de chargement dans tous les cas
      setIsSubmitting(false);
    }
  };

  const footerLinks = {
    cuisine: [
      { label: 'Plats traditionnels', href: '/cuisine?category=plats-principaux' },
      { label: 'Entrées', href: '/cuisine?category=entrees' },
      { label: 'Desserts', href: '/cuisine?category=desserts' },
      { label: 'Épices', href: '/cuisine?category=epices' },
    ],
    art: [
      { label: 'Peintures', href: '/art?category=peinture' },
      { label: 'Sculptures', href: '/art?category=sculpture' },
      { label: 'Photographie', href: '/art?category=photographie' },
      { label: 'Artisanat', href: '/art?category=artisanat' },
    ],
    support: [
      { label: 'Centre d\'aide', href: '/help' },
      { label: 'Contact', href: '/contact' },
      { label: 'Livraison', href: '/shipping' },
      { label: 'Retours', href: '/returns' },
    ],
    legal: [
      { label: 'Conditions d\'utilisation', href: '/' },
      { label: 'Politique de confidentialité', href: '/' },
      { label: 'Mentions légales', href: '/' },
      { label: 'CGV', href: '/terms-of-sale' },
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/geeza_cuisine/', label: 'Instagram' },
    { icon: Video, href: 'https://tiktok.com/ethioculture', label: 'TikTok' },
  ];

  return (
    <footer className="bg-ethiopian-black text-white">
      {/* Newsletter Section - Responsive */}
      <div className="bg-gradient-to-r from-ethiopian-red to-ethiopian-gold py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Restez informé de nos nouveautés
            </h3>
            <p className="text-white/90 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Recevez nos dernières actualités, nouveaux produits et événements culturels directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              />
              <Button className="bg-white text-ethiopian-black hover:bg-white/90 text-sm sm:text-base">
                S'abonner
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Responsive */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            
            {/* Logo et Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4 sm:mb-6">
                <img 
                  src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758215446/Simple_Modern_Minimalist_Circle_Design_Studio_Logo-removebg-preview_brerxw.png" 
                  alt="EthioCulture Logo" 
                  className="h-8 sm:h-10 lg:h-12 w-auto mr-2 sm:mr-3" 
                />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold">EthioCulture</span>
              </div>
              <p className="text-white/80 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
                Découvrez l'authenticité de la culture éthiopienne à travers notre sélection de plats traditionnels 
                et d'œuvres d'art uniques. Une expérience culturelle complète.
              </p>
              
              {/* Contact Info - Responsive */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center text-white/80 text-sm sm:text-base">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-ethiopian-gold flex-shrink-0" />
                  <span className="break-words">Dakar, Sénégal</span>
                </div>
                <div className="flex items-center text-white/80 text-sm sm:text-base">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-ethiopian-gold flex-shrink-0" />
                  <span>+221 786600707</span>
                </div>
                <div className="flex items-center text-white/80 text-sm sm:text-base">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-ethiopian-gold flex-shrink-0" />
                  <span className="break-all">contact@ethioculture.fr</span>
                </div>
              </div>
            </div>

            {/* Cuisine */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-ethiopian-gold">
                Cuisine
              </h4>
              <ul className="space-y-2">
                {footerLinks.cuisine.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-ethiopian-gold transition-colors text-sm sm:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Art & Culture */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-ethiopian-gold">
                Art & Culture
              </h4>
              <ul className="space-y-2">
                {footerLinks.art.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-ethiopian-gold transition-colors text-sm sm:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-ethiopian-gold">
                Support
              </h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-ethiopian-gold transition-colors text-sm sm:text-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/20" />

       {/* ===== FORMULAIRE D'INSCRIPTION ADMIN - MASQUÉ ===== */}
       {/* 
       <div className="bg-ethiopian-black/50 py-6 sm:py-8">
         <div className="container mx-auto px-4">
           <div className="max-w-2xl mx-auto">
             
             <div className="text-center mb-4 sm:mb-6">
               <Button
                 onClick={() => setShowAdminForm(!showAdminForm)}
                 variant="outline"
                 className="border-ethiopian-gold text-ethiopian-gold hover:bg-ethiopian-gold hover:text-black transition-all duration-300"
               >
                 <Shield className="h-4 w-4 mr-2" />
                 {showAdminForm ? 'Masquer' : 'Inscription Administrateur'}
                 <UserPlus className="h-4 w-4 ml-2" />
               </Button>
             </div>
             
             {showAdminForm && (
               <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                 
                 <CardHeader className="pb-3 sm:pb-4">
                   <CardTitle className="text-center text-white flex items-center justify-center">
                     <Shield className="h-5 w-5 mr-2 text-ethiopian-gold" />
                     Créer un compte Administrateur
                   </CardTitle>
                 </CardHeader>
                 
                 <CardContent>
                   <form onSubmit={handleAdminSubmit} className="space-y-4">
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       
                       <div>
                         <Label htmlFor="adminFirstName" className="text-white text-sm">
                           Prénom *
                         </Label>
                         <Input
                           id="adminFirstName"
                           type="text"
                           value={adminForm.firstName}
                           onChange={(e) => setAdminForm({...adminForm, firstName: e.target.value})}
                           className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                           placeholder="Prénom"
                           required
                         />
                       </div>
                       
                       <div>
                         <Label htmlFor="adminLastName" className="text-white text-sm">
                           Nom *
                         </Label>
                         <Input
                           id="adminLastName"
                           type="text"
                           value={adminForm.lastName}
                           onChange={(e) => setAdminForm({...adminForm, lastName: e.target.value})}
                           className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                           placeholder="Nom"
                           required
                         />
                       </div>
                     </div>
                     
                     <div>
                       <Label htmlFor="adminEmail" className="text-white text-sm">
                         Email *
                       </Label>
                       <Input
                         id="adminEmail"
                         type="email"
                         value={adminForm.email}
                         onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                         className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
                         placeholder="admin@ethioculture.com"
                         required
                       />
                     </div>
                     
                     <div>
                       <Label htmlFor="adminPassword" className="text-white text-sm">
                         Mot de passe *
                       </Label>
                       <div className="relative">
                         <Input
                           id="adminPassword"
                           type={showPassword ? "text" : "password"}
                           value={adminForm.password}
                           onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                           className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 pr-10"
                           placeholder="Minimum 6 caractères"
                           required
                           minLength={6}
                         />
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           className="absolute right-0 top-0 h-full px-3 hover:bg-white/10"
                           onClick={() => setShowPassword(!showPassword)}
                         >
                           {showPassword ? (
                             <EyeOff className="h-4 w-4 text-white/70" />
                           ) : (
                             <Eye className="h-4 w-4 text-white/70" />
                           )}
                         </Button>
                       </div>
                     </div>
                     
                     <div>
                       <Label htmlFor="adminConfirmPassword" className="text-white text-sm">
                         Confirmer le mot de passe *
                       </Label>
                       <div className="relative">
                         <Input
                           id="adminConfirmPassword"
                           type={showConfirmPassword ? "text" : "password"}
                           value={adminForm.confirmPassword}
                           onChange={(e) => setAdminForm({...adminForm, confirmPassword: e.target.value})}
                           className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 pr-10"
                           placeholder="Confirmer le mot de passe"
                           required
                         />
                         <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           className="absolute right-0 top-0 h-full px-3 hover:bg-white/10"
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                         >
                           {showConfirmPassword ? (
                             <EyeOff className="h-4 w-4 text-white/70" />
                           ) : (
                             <Eye className="h-4 w-4 text-white/70" />
                           )}
                         </Button>
                       </div>
                     </div>
                     
                     <div className="pt-2">
                       <Button
                         type="submit"
                         disabled={isSubmitting}
                         className="w-full bg-ethiopian-gold hover:bg-yellow-600 text-black font-semibold"
                       >
                         {isSubmitting ? (
                           <>
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                             Création...
                           </>
                         ) : (
                           <>
                             <UserPlus className="h-4 w-4 mr-2" />
                             Créer l'Administrateur
                           </>
                         )}
                       </Button>
                     </div>
                   </form>
                 </CardContent>
               </Card>
             )}
           </div>
         </div>
       </div>
       */}

      <Separator className="bg-white/20" />

      {/* Bottom Footer - Responsive */}
      <div className="py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            
            {/* Copyright */}
            <div className="flex items-center text-white/60 text-xs sm:text-sm text-center sm:text-left">
              <span>© {currentYear} EthioCulture. Tous droits réservés.</span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4 text-xs sm:text-sm">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.label}
                  to={link.href}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social Links - Responsive */}
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-ethiopian-gold transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
