import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Utensils, Palette } from "lucide-react";
import { ApiTest } from "@/components/ApiTest";
import cuisineHero from "@/assets/ethiopian-cuisine-hero.jpg";
import artHero from "@/assets/ethiopian-art-hero.jpg";

const HomePage = () => {
  const featuredEvents = [
    {
      title: "Exposition d'Art Contemporain Éthiopien",
      date: "25 Oct - 15 Nov",
      image: artHero,
    },
    {
      title: "Festival Culinaire Traditionnel",
      date: "5 Nov - 12 Nov", 
      image: cuisineHero,
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/Loumo10.mp4" type="video/mp4" />
            <source src="/your-video.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0  from-gray-900/60 via-black/60 to-blue-900/60" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-cultural-fade">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-ethiopian-gold">
            <img 
                  src="https://res.cloudinary.com/dprbhsvxl/image/upload/v1758215446/Simple_Modern_Minimalist_Circle_Design_Studio_Logo-removebg-preview_brerxw.png" 
                  alt="Logo Geeza" 
                  className="h-20 w-auto inline" 
                />
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Découvrez l'authenticité de la cuisine éthiopienne et la richesse de son patrimoine artistique
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-warm animate-ethiopian-pulse">
              Explorer la Cuisine
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ethiopian-black">
              Découvrir l'Art
            </Button>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Cuisine Section */}
            <Link to="/cuisine" className="group">
              <Card className="h-full overflow-hidden border-0 shadow-cultural hover:shadow-warm transition-all duration-300 transform group-hover:scale-105">
                <div className="relative h-80">
                  <img 
                    src={cuisineHero} 
                    alt="Cuisine Éthiopienne"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <Utensils className="h-8 w-8 mb-3 text-ethiopian-gold" />
                    <h2 className="text-2xl font-bold mb-2">Cuisine Éthiopienne</h2>
                    <p className="text-gray-200">Saveurs authentiques et traditions millénaires</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-ethiopian-green font-semibold">Commander maintenant</span>
                    <ArrowRight className="h-5 w-5 text-ethiopian-green group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Art Section */}
            <Link to="/art" className="group">
              <Card className="h-full overflow-hidden border-0 shadow-cultural hover:shadow-warm transition-all duration-300 transform group-hover:scale-105">
                <div className="relative h-80">
                  <img 
                    src={artHero} 
                    alt="Art & Culture Éthiopien"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <Palette className="h-8 w-8 mb-3 text-ethiopian-gold" />
                    <h2 className="text-2xl font-bold mb-2">Art & Culture</h2>
                    <p className="text-gray-200">Œuvres d'art et événements culturels</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-ethiopian-red font-semibold">Découvrir la galerie</span>
                    <ArrowRight className="h-5 w-5 text-ethiopian-red group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Événements à venir</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ne manquez pas nos événements spéciaux alliant gastronomie et art éthiopiens
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredEvents.map((event, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-cultural hover:shadow-warm transition-shadow animate-cultural-fade">
                <div className="relative h-48">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-ethiopian-gold font-semibold text-sm">{event.date}</p>
                    <h3 className="text-lg font-bold">{event.title}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Test de connexion API - Section de développement */}
      {import.meta.env.VITE_APP_ENV === 'development' && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Test de Connexion Backend</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Vérifiez que le frontend peut communiquer avec le backend Geezaback
              </p>
            </div>
            <ApiTest />
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;