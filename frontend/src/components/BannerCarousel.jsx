import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'The Great Indian Festival Sale is Live!',
    subtitle: 'Up to 80% OFF on Mobiles, Laptops & Premium Electronics',
    bg: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80',
    link: '/?category=Electronics'
  },
  {
    id: 2,
    title: 'Flipkart Big Billion Days Special',
    subtitle: 'Unbeatable price cuts on iPhone 15 Pro, Galaxy S24 & Smart TVs',
    bg: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&q=80',
    link: '/?category=Mobiles'
  },
  {
    id: 3,
    title: 'Upgrade Your Home & Fashion Wardrobe',
    subtitle: 'Extra 10% instant bank discount on HDFC & SBI cards',
    bg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    link: '/?category=Fashion'
  }
];

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.bg})` }}
        >
          <div className="slide-overlay" />
          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
            <Link to={slide.link} className="btn-primary">
              Explore Deals Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          top: '50%',
          left: '1rem',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          cursor: 'pointer'
        }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          top: '50%',
          right: '1rem',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          cursor: 'pointer'
        }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default BannerCarousel;
