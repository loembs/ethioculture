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
    <div className="min-h-screen bg-white">
      {/* Bannière défilante */}
      <div className="bg-ethiopian-gold overflow-hidden py-3 relative">
        <div className="flex animate-scroll">
          <div className="flex whitespace-nowrap">
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
          </div>
          <div className="flex whitespace-nowrap" aria-hidden="true">
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
            <span className="text-black font-semibold text-lg mx-8">🎉 BIENTÔT DISPONIBLE</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <br />
          <br />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Concept Store
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Une boutique éthique et authentique célébrant le savoir-faire africain. 
            De l'artisanat au design, chaque produit raconte une histoire.
          </p>

          {/* Notification Form */}
          {!isSubscribed ? (
            <form onSubmit={handleNotifyMe} className="max-w-md mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      size="lg"
                      className="bg-ethiopian-gold hover:bg-ethiopian-gold/90 text-black font-semibold"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Me Notifier
                    </Button>
                  </div>
                  <p className="text-gray-500 text-sm mt-3 text-center">
                    Soyez informé en avant-première de l'ouverture
                  </p>
                </CardContent>
              </Card>
            </form>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">C'est noté !</h3>
                <p className="text-gray-600 text-sm">
                  Vous recevrez un email dès l'ouverture du Concept Store
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ce qui vous attend
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une sélection unique de produits africains éthiques et authentiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {upcomingCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.title}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6">
                      <Icon className="h-8 w-8 text-gray-700" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {category.title}
                    </h3>
                    
                    <p className="text-base text-gray-600 mb-4">
                      {category.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    <Store className="h-6 w-6 text-gray-700" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Notre Engagement
                  </h2>
                </div>
                
                <div className="space-y-6 text-gray-700">
                  <p className="text-lg">
                    Le <strong>Concept Store GeezaCulture</strong> sera bien plus qu'une simple boutique. 
                    C'est un espace de rencontre entre artisans, créateurs et consommateurs conscients.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 pt-4">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-gray-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Produits Éthiques</h4>
                        <p className="text-sm text-gray-600">Commerce équitable et durable</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-gray-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Authenticité</h4>
                        <p className="text-sm text-gray-600">Créations 100% artisanales</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-gray-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Soutien aux Artisans</h4>
                        <p className="text-sm text-gray-600">Rémunération juste et directe</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-gray-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Histoires Uniques</h4>
                        <p className="text-sm text-gray-600">Chaque produit a son récit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            En attendant l'ouverture
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Découvrez dès maintenant notre cuisine authentique et notre galerie d'art
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto sm:max-w-none">
            <Link to="/cuisine" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full bg-ethiopian-gold hover:bg-ethiopian-gold/90 text-black font-semibold"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Commander des Plats
              </Button>
            </Link>
            
            <Link to="/art" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full border-2 border-ethiopian-gold text-ethiopian-gold hover:bg-ethiopian-gold hover:text-black font-semibold"
              >
                <Store className="h-5 w-5 mr-2" />
                Explorer l'Art
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Une question sur le Concept Store ?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Notre équipe est à votre disposition pour toute information
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="mailto:geezacultures@gmail.com" className="text-gray-700 hover:text-gray-900 font-medium flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                geezacultures@gmail.com
              </a>
              
              <span className="hidden sm:inline text-gray-300">•</span>
              
              <a href="tel:+221786600707" className="text-gray-700 hover:text-gray-900 font-medium flex items-center">
                <Bell className="h-5 w-5 mr-2" />
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




