import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Package, 
  ShoppingBag, 
  Heart, 
  Globe, 
  Sparkles,
  Mail,
  Bell,
  ArrowRight,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ConceptStorePage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive"
      });
      return;
    }

    // Simuler l'inscription
    setIsSubscribed(true);
    toast({
      title: "Merci !",
      description: "Nous vous informerons dès l'ouverture du Concept Store"
    });
    setEmail("");
  };

  const upcomingCategories = [
    {
      icon: Package,
      title: "Artisanat",
      description: "Créations authentiques faites main par des artisans africains",
      items: ["Poteries", "Tissages", "Bijoux", "Sculptures"]
    },
    {
      icon: ShoppingBag,
      title: "Design",
      description: "Pièces contemporaines alliant tradition et modernité",
      items: ["Mobilier", "Décoration", "Textiles", "Accessoires"]
    },
    {
      icon: Heart,
      title: "Produits Culinaires",
      description: "Épices, condiments et produits sélectionnés d'Afrique",
      items: ["Épices éthiopiennes", "Cafés", "Thés", "Condiments"]
    },
    {
      icon: Globe,
      title: "Œuvres d'Art",
      description: "Sélection exclusive d'œuvres d'artistes africains",
      items: ["Peintures", "Photographies", "Art numérique", "Installations"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/Geeza02.jpg" 
            alt="Concept Store GeezaCulture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ethiopian-green/90 via-ethiopian-gold/80 to-ethiopian-red/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <Badge className="mb-4 sm:mb-6 bg-white/20 text-white border-white/40 text-xs sm:text-sm px-4 py-2">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Bientôt Disponible
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl">
            Concept Store
            <span className="block text-ethiopian-gold mt-2">GeezaCulture</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Une boutique éthique et authentique célébrant le savoir-faire africain. 
            De l'artisanat au design, chaque produit raconte une histoire.
          </p>

          {/* Notification Form */}
          {!isSubscribed ? (
            <form onSubmit={handleNotifyMe} className="max-w-md mx-auto">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                      <Input
                        type="email"
                        placeholder="Votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:bg-white/20"
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      size="lg"
                      className="bg-ethiopian-gold hover:bg-yellow-600 text-black font-semibold"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Me Notifier
                    </Button>
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm mt-3 text-center sm:text-left">
                    Soyez informé en avant-première de l'ouverture
                  </p>
                </CardContent>
              </Card>
            </form>
          ) : (
            <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">C'est noté !</h3>
                <p className="text-white/80 text-sm">
                  Vous recevrez un email dès l'ouverture du Concept Store
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Ce qui vous attend
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Une sélection unique de produits africains éthiques et authentiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {upcomingCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.title}
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-ethiopian-gold/30"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 sm:p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-ethiopian-gold/10 mb-4 sm:mb-6 group-hover:bg-ethiopian-gold/20 transition-colors">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-ethiopian-gold" />
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {category.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      {category.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="flex items-center text-xs sm:text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-ethiopian-gold mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-ethiopian-gold/20 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-ethiopian-gold/10 to-ethiopian-green/10 p-8 sm:p-10 md:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-ethiopian-gold/20 flex items-center justify-center mr-4">
                    <Store className="h-6 w-6 text-ethiopian-gold" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Notre Engagement
                  </h2>
                </div>
                
                <div className="space-y-4 sm:space-y-6 text-gray-700">
                  <p className="text-base sm:text-lg leading-relaxed">
                    Le <strong>Concept Store GeezaCulture</strong> sera bien plus qu'une simple boutique. 
                    C'est un espace de rencontre entre artisans, créateurs et consommateurs conscients.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-ethiopian-green mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Produits Éthiques</h4>
                        <p className="text-sm text-gray-600">Commerce équitable et durable</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-ethiopian-green mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Authenticité</h4>
                        <p className="text-sm text-gray-600">Créations 100% artisanales</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-ethiopian-green mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Soutien aux Artisans</h4>
                        <p className="text-sm text-gray-600">Rémunération juste et directe</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-ethiopian-green mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Histoires Uniques</h4>
                        <p className="text-sm text-gray-600">Chaque produit a son récit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-ethiopian-red to-ethiopian-gold">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            En attendant l'ouverture
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Découvrez dès maintenant notre cuisine authentique et notre galerie d'art
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto sm:max-w-none">
            <Link to="/cuisine" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full bg-white text-ethiopian-red hover:bg-gray-100 font-semibold px-8 py-6 text-base sm:text-lg rounded-xl shadow-xl"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Commander des Plats
              </Button>
            </Link>
            
            <Link to="/art" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full border-2 border-white text-white hover:bg-white hover:text-ethiopian-gold font-semibold px-8 py-6 text-base sm:text-lg rounded-xl bg-transparent"
              >
                <Store className="h-5 w-5 mr-2" />
                Explorer l'Art
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Une question sur le Concept Store ?
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Notre équipe est à votre disposition pour toute information
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="mailto:geezacultures@gmail.com" className="text-ethiopian-gold hover:text-ethiopian-gold/80 font-medium text-sm sm:text-base flex items-center">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                geezacultures@gmail.com
              </a>
              
              <span className="hidden sm:inline text-gray-300">•</span>
              
              <a href="tel:+221786600707" className="text-ethiopian-gold hover:text-ethiopian-gold/80 font-medium text-sm sm:text-base flex items-center">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                +221 78 660 07 07
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConceptStorePage;



