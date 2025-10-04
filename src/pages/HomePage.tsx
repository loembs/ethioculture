import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Utensils, Palette } from "lucide-react";
import { ApiTest } from "@/components/ApiTest";
import { useState, useEffect } from "react";
import cuisineHero from "@/assets/ethiopian-cuisine-hero.jpg";
import artHero from "@/assets/ethiopian-art-hero.jpg";

const HomePage = () => {
  // Images du carrousel
  const carouselImages = [
    '/Geeza02.jpg',
    '/Geeza03.jpg', 
    '/Geeza04.jpg',
    '/Geeza05.jpg',
    '/evenement.jpg'
  ];

  // Contenu dynamique pour le hero
  const heroContent = [
    {
      title: "Découvrez l'art de la",
      subtitle: "cuisine éthiopienne",
      description: "Une expérience culinaire authentique où tradition et modernité se rencontrent dans une ambiance chaleureuse et raffinée."
    },
    {
      title: "Explorez la richesse de",
      subtitle: "l'art Africain",
      description: "Des œuvres contemporaines qui célèbrent l'héritage culturel  à travers des créations artistiques uniques et inspirantes."
    },
    {
      title: "Participez aux",
      subtitle: "événements culturels",
      description: "Des moments de partage et de découverte où la culture éthiopienne prend vie à travers des expositions, concerts et rencontres."
    },
    {
      title: "Dégustez l'authenticité de",
      subtitle: "la tradition éthiopienne",
      description: "Chaque plat raconte une histoire, chaque épice révèle un secret ancestral transmis de génération en génération."
    },
    {
      title: "Immergez-vous dans",
      subtitle: "l'expérience Geeza",
      description: "Un voyage sensoriel complet où cuisine, art et culture se mêlent pour créer des souvenirs inoubliables et enrichissants."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotation du carrousel et du contenu
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      // Changer le contenu après un court délai pour permettre l'animation de sortie
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        setIsAnimating(false);
      }, 300);
    }, 5000); // Change toutes les 5 secondes pour plus de temps de lecture

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Fonction pour obtenir les 3 images visibles simultanément
  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % carouselImages.length;
      visible.push({
        src: carouselImages[index],
        alt: `Image ${index + 1}`,
        className: i === 0 ? 'active' : i === 1 ? 'next' : 'prev'
      });
    }
    return visible;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Terrou-Bi Inspired */}
      <section className="relative min-h-screen w-full">
        {/* Modern Triple Carousel Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="triple-carousel-container">
            {getVisibleImages().map((image, index) => (
              <div key={`${currentIndex}-${index}`} className={`carousel-slide ${image.className}`}>
                <img
                  src={image.src}
                  alt={image.alt}
            className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-ethiopian-gold scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Bar */}

        {/* Main Hero Content */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl">
              {/* Dynamic Title - Responsive */}
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-6 sm:mb-8 leading-tight transition-all duration-600 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                {heroContent[currentIndex].title}
                <span className="block font-bold text-ethiopian-gold mt-1 sm:mt-2">
                  {heroContent[currentIndex].subtitle}
                </span>
              </h1>

              {/* Dynamic Subtitle - Responsive */}
              <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-2xl leading-relaxed font-light transition-all duration-600 delay-100 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                {heroContent[currentIndex].description}
              </p>

              {/* CTA Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/cuisine">
                  <Button 
                    size="lg" 
                    className="bg-ethiopian-gold hover:bg-yellow-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    Découvrir notre menu
                  </Button>
                </Link>
                <Link to="/art">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-300 w-full sm:w-auto bg-transparent hover:bg-white hover:text-black"
                  >
                    Explorer l'art
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Bar - Responsive */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-t border-white/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-white/80 text-xs sm:text-sm space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4 sm:space-x-8">
                <span>Ouvert Mercredi- Dimanche</span>
                <span>11h00 - 18h00</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
                <span className="hidden sm:inline">+221 78 660 07 07</span>
                <span className="hidden md:inline">geezacultures@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Responsive */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                Une cuisine de produits locaux
                <span className="block font-bold text-ethiopian-gold mt-1 sm:mt-2">
                  de la terre et de la mer
                </span>
              </h2>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Découvrez notre menu confortablement installés dans notre espace chaleureux, 
                entourés de plantes qui rappellent la proximité de la nature. Notre carte 
                propose une cuisine aux saveurs éthiopiennes qui vous emmènera en voyage.
              </p>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Toutes nos recettes sont préparées à partir d'ingrédients bruts transformés 
                dans nos ateliers. Nous sommes fiers de notre expertise et de vous offrir 
                une cuisine maison qui allie qualité et traçabilité.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/cuisine">
                  <Button className="bg-ethiopian-gold hover:bg-yellow-600 text-black font-semibold px-6 sm:px-8 py-3 rounded-xl w-full sm:w-auto">
                    Découvrir notre menu
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="border-2 border-gray-900 text-black font-semibold px-6 sm:px-8 py-3 rounded-xl w-full sm:w-auto">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="/Geeza02.jpg"
                  alt="Cuisine éthiopienne"
                  className="w-full h-64 object-cover"
                />
                <img 
                  src="/Geeza04.jpg"
                  alt="Art éthiopien"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="/Geeza05.jpg"
                  alt="Cérémonie du café"
                  className="w-full h-48 object-cover"
                />
                <img 
                  src="/evenement.jpg"
                  alt="Traditions éthiopiennes"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
                  </div>
                </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Nos <span className="font-bold text-ethiopian-gold">Spécialités</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une expérience complète alliant gastronomie authentique et art contemporain
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cuisine */}
            <div className="text-center group">
              <div className="mb-6">
                <Utensils className="h-16 w-16 text-ethiopian-gold mx-auto group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cuisine Authentique</h3>
              <p className="text-gray-600 leading-relaxed">
                Découvrez les saveurs traditionnelles éthiopiennes préparées avec des ingrédients locaux 
                et des techniques ancestrales transmises de génération en génération.
              </p>
                  </div>
            
            {/* Art */}
            <div className="text-center group">
              <div className="mb-6">
                <Palette className="h-16 w-16 text-ethiopian-gold mx-auto group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Art Contemporain</h3>
              <p className="text-gray-600 leading-relaxed">
                Immersion dans l'art africain contemporain avec des œuvres d'artistes locaux 
                et internationaux qui célèbrent la richesse culturelle éthiopienne.
              </p>
                  </div>
            
            {/* Événements */}
            <div className="text-center group">
              <div className="mb-6">
                <ArrowRight className="h-16 w-16 text-ethiopian-gold mx-auto group-hover:scale-110 transition-transform" />
                </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Événements Culturels</h3>
              <p className="text-gray-600 leading-relaxed">
                Participez à nos événements culturels, concerts et expositions qui mettent en valeur 
                la diversité et la créativité de la culture éthiopienne moderne.
              </p>
                  </div>
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