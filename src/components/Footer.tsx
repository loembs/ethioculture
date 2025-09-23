import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ArrowRight
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

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
      { label: 'Conditions d\'utilisation', href: '/terms' },
      { label: 'Politique de confidentialité', href: '/privacy' },
      { label: 'Mentions légales', href: '/legal' },
      { label: 'CGV', href: '/terms-of-sale' },
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/ethioculture', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/ethioculture', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/ethioculture', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/ethioculture', label: 'YouTube' },
  ];

  return (
    <footer className="bg-ethiopian-black text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-ethiopian-red to-ethiopian-gold py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Restez informé de nos nouveautés
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Recevez nos dernières actualités, nouveaux produits et événements culturels directement dans votre boîte mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              />
              <Button className="bg-white text-ethiopian-black hover:bg-white/90">
                S'abonner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Logo et Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <img 
                  src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758215446/Simple_Modern_Minimalist_Circle_Design_Studio_Logo-removebg-preview_brerxw.png" 
                  alt="EthioCulture Logo" 
                  className="h-12 w-auto mr-3" 
                />
                <span className="text-2xl font-bold">EthioCulture</span>
              </div>
              <p className="text-white/80 mb-6 max-w-md">
                Découvrez l'authenticité de la culture éthiopienne à travers notre sélection de plats traditionnels 
                et d'œuvres d'art uniques. Une expérience culturelle complète.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-white/80">
                  <MapPin className="h-5 w-5 mr-3 text-ethiopian-gold" />
                  <span>123 Rue de la Culture, 75001 Paris, France</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Phone className="h-5 w-5 mr-3 text-ethiopian-gold" />
                  <span>+33 1 23 45 67 89</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Mail className="h-5 w-5 mr-3 text-ethiopian-gold" />
                  <span>contact@ethioculture.fr</span>
                </div>
              </div>
            </div>

            {/* Cuisine */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-ethiopian-gold">
                Cuisine
              </h4>
              <ul className="space-y-2">
                {footerLinks.cuisine.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-ethiopian-gold transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Art & Culture */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-ethiopian-gold">
                Art & Culture
              </h4>
              <ul className="space-y-2">
                {footerLinks.art.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-ethiopian-gold transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-ethiopian-gold">
                Support
              </h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-white/80 hover:text-ethiopian-gold transition-colors text-sm"
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

      {/* Bottom Footer */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="flex items-center text-white/60 text-sm">
              <span>© {currentYear} EthioCulture. Tous droits réservés.</span>
              <span className="mx-2">•</span>
              <span>Fait avec</span>
              <Heart className="h-4 w-4 mx-1 text-ethiopian-red fill-current" />
              <span>en France</span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-sm">
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

            {/* Social Links */}
            <div className="flex gap-4">
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
                    <Icon className="h-5 w-5" />
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
