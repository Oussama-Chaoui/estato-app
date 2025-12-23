"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { ArrowRight, MoveRight } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { motion, AnimatePresence } from "framer-motion";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const properties = [
  {
    id: 1,
    image: "/house_1.jpg",
    title: "Oceanview Villa",
    location: "Tangier",
    price: "25,000,000 MAD",
    description: "Luxurious Mediterranean retreat with panoramic ocean views"
  },
  {
    id: 2,
    image: "/house_2.jpg",
    title: "Riad Elegance",
    location: "Marrakech",
    price: "18,500,000 MAD",
    description: "Authentic Moroccan riad in the heart of the medina"
  },
  {
    id: 3,
    image: "/house_3.jpg",
    title: "Modern City Loft",
    location: "Casablanca",
    price: "32,000,000 MAD",
    description: "Contemporary urban living in Morocco's business hub"
  },
  {
    id: 4,
    image: "/house_4.jpg",
    title: "Blue Kasbah Retreat",
    location: "Chefchaouen",
    price: "12,750,000 MAD",
    description: "Traditional kasbah with stunning Rif Mountain views"
  },
  {
    id: 5,
    image: "/house_5.jpg",
    title: "Summer Beach Villa",
    location: "Fnideq",
    price: "15,000,000 MAD",
    description: "Exclusive Mediterranean beachfront property"
  },
];

const FeaturedProperties = () => {
  const [activeProperty, setActiveProperty] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);


  const handleNext = () => {
    setDirection("right");
    setActiveProperty((prev) => (prev + 1) % properties.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setActiveProperty((prev) => (prev - 1 + properties.length) % properties.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();

    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };



  useEffect(() => {
    const interval = setInterval(handleNext, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-primary-50 py-10 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-12">
          <div className="max-w-[400] space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={cn(
                poppins.className,
                "text-4xl md:text-5xl font-bold text-slate-900 leading-tight",
                "bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent"
              )}
            >
              Moroccan Luxury Estates
            </motion.h1>
            <p
              className={cn(
                poppins.className,
                "text-slate-600 text-lg font-medium leading-relaxed"
              )}
            >
              Discover Morocco&apos;s most exclusive properties, from coastal villas to historic riads
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              className={cn(
                poppins.className,
                "group w-fit px-6 py-4 bg-gradient-to-r from-primary-700 to-primary-500 text-white",
                "text-base font-semibold tracking-wide rounded-lg",
                "hover:scale-[1.02] transition-all duration-300",
                "shadow-lg hover:shadow-xl shadow-primary-700/10",
                "flex items-center gap-2"
              )}
            >
              Explore Collection
              <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        {/* Gallery */}
        {/* Set grid height on large screens so both columns are equal */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-6 h-[450px] lg:h-[500px]">
          {/* Main Image */}
          {/* Remove aspect ratio classes and use h-full to fill the grid cell */}
          <div
            className="relative h-full rounded-xl overflow-hidden group"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeProperty}
                custom={direction}
                initial={{ opacity: 0, x: direction === "right" ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "right" ? -100 : 100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={properties[activeProperty].image}
                  alt={properties[activeProperty].title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

                {/* Info Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/70 backdrop-blur-xl p-4 rounded-lg shadow-xl">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            poppins.className,
                            "text-primary-500 font-semibold text-xl"
                          )}
                        >
                          {String(activeProperty + 1).padStart(2, "0")}
                        </span>
                        <div className="h-px w-6 bg-slate-300" />
                        <span className="text-slate-500 font-medium text-sm">
                          {properties[activeProperty].location}
                        </span>
                      </div>
                      <h2
                        className={cn(
                          poppins.className,
                          "text-2xl font-bold text-slate-900"
                        )}
                      >
                        {properties[activeProperty].title}
                      </h2>
                      <p
                        className={cn(
                          poppins.className,
                          "text-base text-slate-600 mt-1"
                        )}
                      >
                        {properties[activeProperty].description}
                      </p>
                      <p
                        className={cn(
                          poppins.className,
                          "text-xl font-semibold text-primary-500 mt-2"
                        )}
                      >
                        {properties[activeProperty].price}
                      </p>
                    </div>
                    <button
                      className="p-3 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors shadow-lg cursor-pointer z-50"
                    >
                      <ArrowRight className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 w-full flex justify-between items-center px-4">
              <button
                onClick={handlePrev}
                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-105 transition-transform hidden lg:block"
              >
                <ArrowRight className="h-6 w-6 text-slate-900 rotate-180" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-105 transition-transform hidden lg:block"
              >
                <ArrowRight className="h-6 w-6 text-slate-900" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="hidden lg:flex flex-col gap-3 h-[500px] overflow-y-auto scrollbar-hide pr-2 pb-1">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "relative aspect-square cursor-pointer transition-all",
                  "border-2 hover:border-primary-300 rounded-lg overflow-hidden",
                  index === activeProperty ? "border-primary-500 scale-[1.01]" : "border-slate-200"
                )}
                onClick={() => setActiveProperty(index)}
              >
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2.5 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{property.title}</p>
                      <p className="text-xs text-slate-600">{property.location}</p>
                    </div>
                    <span className="text-base font-bold text-primary-500">
                      {property.price}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {properties.map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                "h-[2px] bg-slate-300 rounded-full transition-all",
                index === activeProperty ? "bg-primary-500 w-12" : "w-6"
              )}
              initial={{ scale: 0.9 }}
              animate={{ scale: index === activeProperty ? 1.1 : 1 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
