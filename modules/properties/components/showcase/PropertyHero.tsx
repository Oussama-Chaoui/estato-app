"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Property as PropertyType } from "@/modules/properties/defs/types";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { useFavoritesManager } from "@/modules/properties/utils/favorites";
import { useTranslation } from "next-i18next";
import { useDirection } from "@/common/contexts/DirectionContext";
import { useRTLIcon } from "@/common/utils/rtl";

interface PropertyHeroProps {
  property: PropertyType;
  websiteFocus: WEBSITE_FOCUS;
}

interface ImageData {
  id: string;
  url: string;
  caption?: string;
  width: number;
  aspectRatio: number;
}

const PropertyHero = ({ property, websiteFocus }: PropertyHeroProps) => {
  const { t } = useTranslation(['properties']);
  const { isRTL } = useDirection();
  const { flipIcon, getArrowClass } = useRTLIcon();
  const [isLiked, setIsLiked] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [modalActiveStep, setModalActiveStep] = useState(0);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toggleFavorite, isPropertyFavorited } = useFavoritesManager();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: "keepSnaps",
    direction: isRTL ? "rtl" : "ltr"
  });

  const sortedImages = useMemo(() => {
    return [...property.images].sort((a, b) => a.ordering - b.ordering);
  }, [property]);

  // Extract loadImageDimensions function to be reusable
  const loadImageDimensions = useCallback(async () => {
    // Get responsive height based on screen size
    const getResponsiveHeight = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 640) return 256; // h-64 (16rem = 256px)
        if (width < 768) return 320; // h-80 (20rem = 320px)
        if (width < 1024) return 384; // h-96 (24rem = 384px)
        return 500; // lg:h-[500px]
      }
      return 500; // fallback
    };

    const fixedHeight = getResponsiveHeight();
    if (sortedImages.length === 0) {
      setImageData([]);
      setImagesLoaded(true);
      return;
    }

    const imagePromises = sortedImages.map((img, index) => {
      if (!img || !img.upload || !img.upload.url) {
        return Promise.reject(new Error(`Invalid image data for index ${index}`));
      }

      return new Promise<ImageData>((resolve, reject) => {
        const imageElement = new window.Image();

        const timeout = setTimeout(() => {
          reject(new Error(`Image ${index} loading timed out: ${img.upload.url}`));
        }, 10000);

        imageElement.onload = () => {
          clearTimeout(timeout);
          const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;
          const calculatedWidth = fixedHeight * aspectRatio;

          const imageData = {
            id: `${index}`,
            url: img.upload.url,
            caption: img.caption || undefined,
            width: calculatedWidth,
            aspectRatio
          };

          resolve(imageData);
        };

        imageElement.onerror = (error) => {
          clearTimeout(timeout);
          reject(new Error(`Failed to load image ${index}: ${img.upload.url}`));
        };

        imageElement.src = img.upload.url;
      });
    });

    try {
      const loadedImages = await Promise.all(imagePromises);
      setImageData(loadedImages);
      setImagesLoaded(true);
    } catch (error) {
      const results = await Promise.allSettled(imagePromises);
      const successfulImages = results
        .map((result, index) => result.status === 'fulfilled' ? result.value : null)
        .filter(Boolean) as ImageData[];

      if (successfulImages.length > 0) {
        setImageData(successfulImages);
        setImagesLoaded(true);
      } else {
        setImagesLoaded(true);
      }
    }
  }, [sortedImages]);

  // Initial load of image dimensions
  useEffect(() => {
    loadImageDimensions();
  }, [loadImageDimensions]);

  // Handle window resize for responsive image dimensions
  useEffect(() => {
    const handleResize = () => {
      if (sortedImages.length > 0) {
        loadImageDimensions();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sortedImages, loadImageDimensions]);

  // Navigation functions
  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi]);

  // Track selected slide
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    const onInit = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('init', onInit);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('init', onInit);
    };
  }, [emblaApi]);

  // Reinitialize carousel when RTL direction changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [isRTL, emblaApi]);

  // Check if property is already liked on component mount and listen for updates
  useEffect(() => {
    const checkIfLiked = () => {
      setIsLiked(isPropertyFavorited(property.id));
    };

    checkIfLiked();

    // Listen for custom favorites update event
    const handleFavoritesUpdated = (e: CustomEvent) => {
      const updatedFavorites = e.detail;
      const isStillFavorited = updatedFavorites.some((fav: any) => fav.id === property.id);
      setIsLiked(isStillFavorited);
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdated as EventListener);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated as EventListener);
    };
  }, [property.id, isPropertyFavorited]);

  const handleImageClick = (index: number) => {
    setModalActiveStep(index);
    setIsGalleryOpen(true);
  };

  // Modal navigation
  const handleModalBack = () => setModalActiveStep((s) => Math.max(s - 1, 0));
  const handleModalNext = () => setModalActiveStep((s) => Math.min(s + 1, imageData.length - 1));

  if (!imagesLoaded) {
    return (
      <section className="relative bg-gray-200 animate-pulse h-64 sm:h-80 md:h-96 lg:h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">{t('showcase.hero.loading_images')}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px]">
      {/* Embla Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container flex h-full items-center">
            {imageData.map((img, index) => (
              <div
                key={`${img.id}-${index}`}
                className="embla__slide relative h-full flex-shrink-0 cursor-pointer group"
                style={{ 
                  width: `${img.width}px`,
                  minWidth: `${img.width}px`,
                  maxWidth: `${img.width}px`
                }}
                onClick={() => handleImageClick(index)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img.url}
                    alt={img.caption || `${t('showcase.hero.image')} ${index + 1}`}
                    fill
                    className="object-cover transition-all duration-300"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                  {/* Center indicator overlay */}
                  <div className={`absolute inset-0 border-2 border-transparent transition-all duration-300 ${
                    selectedIndex === index ? 'border-white/30 shadow-lg' : ''
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className={`absolute top-1/2 -translate-y-1/2 z-20 rounded-full p-2 sm:p-3 transition-all backdrop-blur-sm shadow-lg border border-white/20 bg-black/40 hover:bg-black/60 ${isRTL ? 'right-2 sm:right-4' : 'left-2 sm:left-4'}`}
      >
        <ChevronLeft className={`h-4 w-4 sm:h-6 sm:w-6 text-white drop-shadow-lg ${isRTL ? 'rotate-180' : ''}`} />
      </button>

      <button
        onClick={scrollNext}
        className={`absolute top-1/2 -translate-y-1/2 z-20 rounded-full p-2 sm:p-3 transition-all backdrop-blur-sm shadow-lg border border-white/20 bg-black/40 hover:bg-black/60 ${isRTL ? 'left-2 sm:left-4' : 'right-2 sm:right-4'}`}
      >
        <ChevronRight className={`h-4 w-4 sm:h-6 sm:w-6 text-white drop-shadow-lg ${isRTL ? 'rotate-180' : ''}`} />
      </button>

      {/* Image Indicators */}
      <div className={`absolute top-2 sm:top-4 z-20 flex gap-1 sm:gap-2 ${isRTL ? 'left-2 sm:left-4' : 'right-2 sm:right-4'}`}>
        {imageData.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="h-1.5 sm:h-2 rounded-full transition-all bg-white/50 hover:bg-white/75 w-1.5 sm:w-2 data-[selected=true]:bg-white data-[selected=true]:scale-125 data-[selected=true]:w-4 sm:data-[selected=true]:w-6"
            data-selected={selectedIndex === index}
          />
        ))}
      </div>

      {/* Like Button */}
      <div className={`absolute bottom-3 sm:bottom-6 ${isRTL ? 'left-3 sm:left-6' : 'right-3 sm:right-6'}`}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property, websiteFocus);
          }}
          className="p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isLiked ? "text-primary-500 fill-current" : "text-gray-800"
              }`}
          />
        </button>
      </div>

      {/* Fullscreen Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/90" />
          <DialogContent
            className="inset-0 left-0 top-0 h-screen w-screen max-w-none translate-x-0 translate-y-0
                  border-none outline-none rounded-none p-0 flex items-center justify-center
                  bg-black/90 transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
          >
            {/* Close button */}
            <button
              onClick={() => setIsGalleryOpen(false)}
              className={`absolute top-4 z-50 rounded-full p-2 transition-all
           hover:bg-white/20 hover:backdrop-blur-sm md:top-8 ${isRTL ? 'left-4 md:left-8' : 'right-4 md:right-8'}`}
              aria-label={t('showcase.hero.close')}
            >
              <X className="h-8 w-8 stroke-[1.5] text-white/90 hover:text-white" />
            </button>

            {/* Navigation arrows */}
            <button
              onClick={handleModalBack}
              disabled={modalActiveStep === 0}
              className={`absolute top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 hover:bg-white/20 p-3 disabled:opacity-40 ${isRTL ? 'right-3 md:right-8' : 'left-3 md:left-8'}`}
              aria-label={t('showcase.hero.previous')}
            >
              <ChevronLeft className={`h-6 w-6 text-white ${isRTL ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={handleModalNext}
              disabled={modalActiveStep === imageData.length - 1}
              className={`absolute top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 hover:bg-white/20 p-3 disabled:opacity-40 ${isRTL ? 'left-3 md:left-8' : 'right-3 md:right-8'}`}
              aria-label={t('showcase.hero.next')}
            >
              <ChevronRight className={`h-6 w-6 text-white ${isRTL ? 'rotate-180' : ''}`} />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute left-0 top-0 z-40 w-full overflow-x-auto scrollbar-hide
            bg-gradient-to-b from-black/30 to-transparent pb-4 pt-6 backdrop-blur">
              <div className="flex justify-center space-x-3 px-4">
                {imageData.map((img, i) => (
                  <Image
                    key={i}
                    src={img.url}
                    width={80}
                    height={80}
                    alt=""
                    onClick={() => setModalActiveStep(i)}
                    className={`h-14 w-14 cursor-pointer rounded-lg border-2 object-cover shadow-lg transition-all duration-300 ease-out hover:scale-105 ${i === modalActiveStep
                      ? "scale-105 border-primary-500"
                      : "border-transparent opacity-70 hover:border-white/50"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Main image container */}
            <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
              <Image
                src={imageData[modalActiveStep].url}
                fill
                alt={imageData[modalActiveStep].caption ?? `${t('showcase.hero.image')} ${modalActiveStep + 1}`}
                className="object-contain transition-opacity duration-300"
                priority
              />
            </div>

            {/* Slide counter */}
            <div className={`absolute bottom-4 z-40 rounded-full bg-black/80 px-4 py-2
            font-medium text-white/90 backdrop-blur-sm ${isRTL ? 'left-4' : 'right-4'}`} aria-label={t('showcase.hero.slide_counter')}>
              {modalActiveStep + 1} / {imageData.length}
            </div>

            {/* Caption */}
            {imageData[modalActiveStep].caption && (
              <div className="absolute bottom-4 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2
              px-4 text-center text-sm text-white/90 md:text-base">
                <div className="rounded-lg bg-black/80 px-6 py-3 backdrop-blur-sm">
                  {imageData[modalActiveStep].caption}
                </div>
              </div>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </section>
  );
};

export default PropertyHero;