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
                  className="w-full h-full object-cover blur-sm"
                  style={{ filter: 'blur(4px)' }}
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

      {/* About Section - Bienvenue chez Ge'eza */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                Bienvenue chez 
                <span className="block font-bold text-ethiopian-gold mt-1 sm:mt-2">
                  Ge'eza
                </span>
              </h2>
              
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Un pont entre les cultures, les saveurs et la créativité.
              </h3>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Chez Ge'eza, nous croyons au pouvoir des liens entre les personnes, les lieux et les idées. 
                Né de la rencontre entre l'Afrique de l'Est et l'Afrique de l'Ouest, Ge'eza célèbre ce qui nous unit à travers la gastronomie, l'art et le savoir-faire.
              </p>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Notre mission est de créer un espace où la tradition rencontre l'innovation, et où l'échange culturel devient un mode de vie.
              </p>

              {/* Cuisine Section */}
              <div className="pt-4">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Utensils className="h-5 w-5 mr-2 text-ethiopian-red" />
                  Cuisine
                </h4>
                <p className="text-base text-gray-600 leading-relaxed">
                  Découvrez l'authenticité de la cuisine éthiopienne, réinventée au Sénégal. 
                  Ge'eza propose des plats faits maison, préparés à partir d'ingrédients locaux et de recettes ancestrales qui racontent une histoire de partage et de savoir-faire.
                </p>
              </div>

              {/* Culture Section */}
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-ethiopian-blue" />
                  Culture
                </h4>
                <p className="text-base text-gray-600 leading-relaxed">
                  Ge'eza, c'est bien plus qu'une expérience gastronomique — c'est une plateforme culturelle. 
                  Nous collaborons avec des artistes, musiciens et créateurs locaux pour organiser des événements qui valorisent l'identité africaine et les échanges entre disciplines et régions.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Link to="/cuisine">
                  <Button className="bg-ethiopian-gold hover:bg-yellow-600 text-black font-semibold px-6 sm:px-8 py-3 rounded-xl w-full sm:w-auto">
                    Découvrir notre menu
                  </Button>
                </Link>
                <Link to="/art">
                  <Button variant="outline" className="border-2 border-gray-900 text-black font-semibold px-6 sm:px-8 py-3 rounded-xl w-full sm:w-auto">
                    Explorer l'art
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Image Grid - 2 Cuisine, 2 Tableaux (Art) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* Cuisine 1 */}
                <img 
                  src="/Geeza05.jpg"
                  alt="Cuisine éthiopienne traditionnelle"
                  className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
                {/* Tableau 1 (Art) */}
                <img 
                  src="/tableau1.JPG"
                  alt="Tableau d'art africain"
                  className="w-full h-48 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
              <div className="space-y-4 mt-8">
                {/* Cuisine 2 */}
                <img 
                  src="/Geeza04.jpg"
                  alt="Plats éthiopiens faits maison"
                  className="w-full h-48 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
                {/* Tableau 2 (Art) */}
                <img 
                  src="/tableau2.JPG"
                  alt="Œuvre d'art contemporaine"
                  className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Concept Store & Vision */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
            
            {/* Concept Store */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 md:p-12 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-ethiopian-gold/10 flex items-center justify-center mr-4">
                  <Palette className="h-6 w-6 text-ethiopian-gold" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Concept Store</h3>
              </div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Notre concept store met en avant des produits africains éthiques et authentiques, allant de l'artisanat au design, 
                en passant par des produits culinaires sélectionnés. Chaque création raconte une histoire — celle d'un savoir-faire, 
                d'une communauté et d'un engagement — reliant les artisans, les consommateurs et les cultures à travers une démarche 
                durable et consciente.
              </p>
            </div>

            {/* Notre Vision */}
            <div className="bg-gradient-to-br from-ethiopian-gold/5 to-ethiopian-green/5 rounded-2xl p-8 sm:p-10 md:p-12 border-2 border-ethiopian-gold/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-ethiopian-green/10 flex items-center justify-center mr-4">
                  <ArrowRight className="h-6 w-6 text-ethiopian-green" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Notre Vision</h3>
              </div>
              <div className="space-y-4">
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Ge'eza porte une ambition plus grande : la création de <strong>l'Institut Ge'eza</strong>, un centre culturel et économique 
                  favorisant la collaboration entre l'Afrique de l'Est et l'Afrique de l'Ouest.
                </p>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Depuis Dakar, nous souhaitons bâtir un modèle d'éducation, de créativité et d'entrepreneuriat enraciné dans les 
                  savoirs africains et ouvert sur le monde.
                </p>
                <p className="text-lg sm:text-xl font-semibold text-ethiopian-green italic mt-6">
                  Ge'eza, ce n'est pas seulement un nom — c'est une invitation à redécouvrir l'Afrique à travers ses saveurs, 
                  son art et ses talents.
                </p>
              </div>
            </div>

            {/* CTA Final */}
            <div className="text-center pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/cuisine">
                  <Button size="lg" className="bg-ethiopian-red hover:bg-red-700 text-white font-semibold px-8 py-4 text-lg rounded-xl w-full sm:w-auto">
                    <Utensils className="h-5 w-5 mr-2" />
                    Découvrir la Cuisine
                  </Button>
                </Link>
                <Link to="/art">
                  <Button size="lg" variant="outline" className="border-2 border-ethiopian-blue text-ethiopian-blue hover:bg-ethiopian-blue hover:text-white font-semibold px-8 py-4 text-lg rounded-xl w-full sm:w-auto">
                    <Palette className="h-5 w-5 mr-2" />
                    Explorer l'Art & Culture
                  </Button>
                </Link>
              </div>
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