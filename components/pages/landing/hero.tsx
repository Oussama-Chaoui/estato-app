"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const Hero = () => {
  return (
    <div className="h-screen w-full relative z-0">
      {/* Background Image with Subtle Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Luxury Property"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />
      </div>

      {/* Absolute Container for the Content Card */}
      <div className="absolute top-1/2 lg:right-40 right-8 -translate-y-1/2">
        {/* Motion Wrapper for the Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={cn(
            "md:h-[500px] md:w-[600px] h-[430px] w-[320px] sm:w-[400px] sm:h-[380px]",
            "bg-primaryLight/95 backdrop-blur-sm",
            "rounded-xl border border-white/10",
            "shadow-2xl",
            "px-6 md:px-12 md:pt-12"
          )}
        >
          {/* Tagline */}
          <h2 className={cn(
            poppins.className,
            "text-base font-semibold tracking-[0.2em] text-primarySite/80 mb-4 uppercase"
          )}>
            Featured Property
          </h2>

          {/* Main Headline */}
          <h1 className={cn(
            poppins.className,
            "md:text-6xl text-4xl font-bold text-primarySite mb-2 leading-tight"
          )}>
            Find Your Dream
          </h1>
          <h1 className={cn(
            poppins.className,
            "md:text-6xl text-4xl font-bold text-primarySite mb-4 leading-tight"
          )}>
            Home Today
          </h1>

          {/* Description */}
          <p className={cn(
            poppins.className,
            "font-medium md:text-lg text-base text-gray-700 tracking-wide mb-8"
          )}>
            Explore our exclusive listings to discover the perfect property for you and your family.
          </p>

          {/* CTA Button */}
          <button className={cn(
            poppins.className,
            "relative overflow-hidden",
            "text-white font-bold tracking-widest uppercase",
            "bg-primarySite px-[72px] py-[25px] rounded-lg",
            "hover:bg-primarySite/90 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-primarySite/50",
            "shadow-lg hover:shadow-xl"
          )}>
            View Listings
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity -rotate-45 w-[200%]" />
          </button>
        </motion.div>
      </div>

      {/* Subtle Scrolling Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-sm text-white/80 mb-2">Scroll</span>
        <div className="w-px h-12 bg-white/50" />
      </div>
    </div>
  );
};

export default Hero;
