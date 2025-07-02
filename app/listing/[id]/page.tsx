"use client";
import { useParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/components/lib/utils/twMerge";
import {
  Bath,
  BedDouble,
  Expand,
  Heart,
  MapPin,
  Ruler,
  Users,
  Warehouse,
  Calendar,
  Home,
  TreePine,
  ShieldCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";
import useProperties from "@/modules/properties/hooks/api/useProperties";
import type { Property as PropertyType } from "@/modules/properties/defs/types";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTrigger } from "@/components/ui/dialog";
import { Agent } from "@/modules/agents/defs/types";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const PropertyShowcase = () => {
  const { id } = useParams() as { id: string };
  const propertyId = Number(id);

  const { readOne } = useProperties();
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [modalActiveStep, setModalActiveStep] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<Agent>();


  // fetch the property once on mount/id change
  useEffect(() => {
    setLoading(true);
    readOne(propertyId)
      .then((res) => {
        if (res.success && res.data?.item) {
          setProperty(res.data.item);
        }
      })
      .finally(() => setLoading(false));
  }, [propertyId]);

  // auto-rotate background slides
  useEffect(() => {
    if (!property) return;
    const images = property.images.map((img) => img.upload.url);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  const sortedImages = useMemo(() => {
    if (!property) return [];
    return [...property.images].sort((a, b) => a.ordering - b.ordering);
  }, [property]);

  const maxSteps = sortedImages.length;
  const handleModalBack = () => setModalActiveStep((s) => Math.max(s - 1, 0));
  const handleModalNext = () => setModalActiveStep((s) => Math.min(s + 1, maxSteps - 1));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fafafa]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primarySite border-t-transparent" />
        <h2 className={cn(poppins.className, "text-2xl font-semibold text-gray-700")}>
          Loading Property Details
        </h2>
        <p className="text-gray-500">Please wait while we gather the information</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#fafafa] px-4 text-center">
        <div className="bg-primarySite/10 p-6 rounded-full">
          <Home className="w-16 h-16 text-primarySite" strokeWidth={1.5} />
        </div>
        <h2 className={cn(poppins.className, "text-3xl font-semibold text-gray-800")}>
          Property Not Found
        </h2>
        <p className="text-gray-600 max-w-md">
          We couldn't find the property you're looking for. It may have been removed or the URL is incorrect.
        </p>
        <a
          href="/properties"
          className="mt-4 px-6 py-3 bg-primarySite text-white rounded-lg hover:bg-primarySite/90 transition-colors font-medium"
        >
          Browse Available Properties
        </a>
      </div>
    );
  }

  const bgImages = property.images.map((img) => img.upload.url);
  const galleryImages = bgImages;

  // format price
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: property.currency ?? "MAD",
    maximumFractionDigits: 0,
  }).format(Number(property.salePrice));

  // pretty status ribbon
  const getRibbonColor = (status: string) => {
    switch (status) {
      case "sold":
        return "bg-red-600";
      case "rented":
        return "bg-green-600";
      default:
        return "bg-primarySite";
    }
  };
  const ribbonLabel =
    property.status === "sold"
      ? "Sold"
      : property.status === "rented"
        ? "Rented"
        : "Available";

  return (
    <div className="bg-[#fafafa] min-h-screen mt-[75px]">
      {/* Hero Section */}
      <section className="relative" style={{ height: "calc(100vh - 75px)" }}>
        <div className="absolute inset-0 overflow-hidden">
          {bgImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentSlide === index ? 1 : 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <Image src={img} alt="Property" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Floating Info Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-xl max-w-xs w-full"
        >
          <h1 className={cn(poppins.className, "text-4xl font-bold text-gray-900 mb-2")}>
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-primarySite mb-4">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{property.location.city}</span>
          </div>
          <div className="text-3xl font-bold text-primarySite mb-6">{formattedPrice}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-primarySite text-white py-3 rounded-lg hover:bg-primarySite/90 transition-all font-semibold flex items-center justify-center gap-2"
            onClick={() =>
              window.open(
                "https://calendly.com/oussamaqqqq/house-tour-karim-el-mansouri",
                "_blank"
              )
            }
          >
            <CalendarDays className="w-5 h-5" />
            Schedule Private Tour
          </motion.button>
        </motion.div>

        {/* Gallery & Like Buttons */}
        <div className="absolute bottom-8 right-8 flex gap-4">
          <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
            {/* trigger */}
            <DialogTrigger asChild>
              <button
                onClick={() => setModalActiveStep(0)} // always start at first slide
                className="p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                <Expand className="w-6 h-6 text-gray-800" />
              </button>
            </DialogTrigger>

            <DialogPortal>
              <DialogOverlay className="fixed inset-0 bg-black/10" />

              {/* make this fullscreen: */}
              <DialogContent
                /* full‑screen, no border, no outline, no funky animation */
                className="inset-0 left-0 top-0 h-screen w-screen max-w-none translate-x-0 translate-y-0
                      border-none outline-none rounded-none p-0 flex items-center justify-center
                      bg-black/10 transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
              >
                {/* Close button */}
                <button
                  onClick={() => setIsGalleryOpen(false)}
                  className="absolute right-4 top-4 z-50 rounded-full p-2 transition-all
               hover:bg-white/20 hover:backdrop-blur-sm md:right-8 md:top-8"
                >
                  <X className="h-8 w-8 stroke-[1.5] text-white/90 hover:text-white" />
                </button>



                {/* Navigation arrows */}
                <button
                  onClick={handleModalBack}
                  disabled={modalActiveStep === 0}
                  className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 hover:bg-white/20 p-3 disabled:opacity-40"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>

                {/* next arrow */}
                <button
                  onClick={handleModalNext}
                  disabled={modalActiveStep === maxSteps - 1}
                  className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/10 hover:bg-white/20 p-3 disabled:opacity-40"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>

                {/* Thumbnail strip */}
                <div className="absolute left-0 top-0 z-40 w-full overflow-x-auto scrollbar-hide
                bg-gradient-to-b from-black/30 to-transparent pb-4 pt-6 backdrop-blur">
                  <div className="flex justify-center space-x-3 px-4">
                    {sortedImages.map((img, i) => (
                      <Image
                        key={i}
                        src={img.upload.url}
                        width={80}
                        height={80}
                        alt=""
                        onClick={() => setModalActiveStep(i)}
                        className={`h-14 w-14 cursor-pointer rounded-lg border-2 object-cover shadow-lg transition-all
                    duration-300 ease-out hover:scale-105 ${i === modalActiveStep
                            ? "scale-105 border-primarySite"
                            : "border-transparent opacity-70 hover:border-white/50"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Main image container */}
                <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
                  <Image
                    src={sortedImages[modalActiveStep].upload.url}
                    fill
                    alt={sortedImages[modalActiveStep].caption ?? `Image ${modalActiveStep + 1}`}
                    className="object-contain transition-opacity duration-300"
                    priority
                  />
                </div>

                {/* Slide counter */}
                <div className="absolute bottom-4 right-4 z-40 rounded-full bg-black/80 px-4 py-2
                font-medium text-white/90 backdrop-blur-sm">
                  {modalActiveStep + 1} / {maxSteps}
                </div>

                {/* Caption */}
                {sortedImages[modalActiveStep].caption && (
                  <div className="absolute bottom-4 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2
                  px-4 text-center text-sm text-white/90 md:text-base">
                    <div className="rounded-lg bg-black/80 px-6 py-3 backdrop-blur-sm">
                      {sortedImages[modalActiveStep].caption}
                    </div>
                  </div>
                )}
              </DialogContent>
            </DialogPortal>
          </Dialog>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <Heart
              className={cn(
                "w-6 h-6 transition-colors",
                isLiked ? "text-primarySite fill-current" : "text-gray-800"
              )}
            />
          </button>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 px-8 md:px-20 bg-[#faf8f5]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto"
        >
          {/* Main Content */}
          <div className="md:col-span-2">
            <h2 className={cn(poppins.className, "text-3xl font-bold text-gray-900 mb-8")}>
              {property.title}
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {[
                {
                  icon: <BedDouble className="w-6 h-6" />,
                  label: `${property.features[0].bedrooms} Bedrooms`,
                },
                {
                  icon: <Bath className="w-6 h-6" />,
                  label: `${property.features[0].bathrooms} Bathrooms`,
                },
                {
                  icon: <Ruler className="w-6 h-6" />,
                  label: `${property.features[0].area} m²`,
                },
                {
                  icon: <Warehouse className="w-6 h-6" />,
                  label: `${property.features[0].garages} Garages`,
                },
                {
                  icon: <Calendar className="w-6 h-6" />,
                  label: `Built ${property.yearBuilt}`,
                },
                {
                  icon: <TreePine className="w-6 h-6" />,
                  label: `${property.lotSize} sqm Lot`,
                },
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-2 bg-primarySite/10 rounded-lg text-primarySite">{feat.icon}</div>
                  <span className="font-medium">{feat.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="prose max-w-none mb-12">
              <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>
              <div className="grid gap-4">
                {property.descriptions.map((desc, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primarySite flex-shrink-0" />
                    <span className="text-gray-600">{desc.content}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Price History */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-sm mb-12">
              <h3 className={cn(poppins.className, "text-xl font-bold mb-4")}>Price History</h3>
              <div className="flex gap-8 overflow-x-auto pb-4">
                {property.priceHistory.map((entry, i) => {
                  const pct = (Number(entry.price) / Number(property.salePrice)) * 80;
                  return (
                    <div key={i} className="flex flex-col items-center min-w-[100px]">
                      <div className="h-24 w-1 bg-primarySite/20 relative">
                        <div
                          className="absolute bottom-0 w-full bg-primarySite transition-all duration-500"
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium">{entry.recordedAt.slice(0, 4)}</div>
                      <div className="text-sm text-primarySite">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: property.currency,
                          maximumFractionDigits: 0,
                        }).format(Number(entry.price))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Amenities Section */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-xl mb-12">
              <h3 className={cn(poppins.className, "text-3xl font-bold text-gray-900 mb-6")}>
                Premium Amenities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.amenities.map((amenity, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    className="flex items-center gap-4 p-4 bg-primarySite/5 rounded-xl transition-all"
                  >
                    <div className="p-3 bg-primarySite/10 rounded-lg">
                      <Home className="w-6 h-6 text-primarySite" />
                    </div>
                    <span className="font-medium text-gray-800">{amenity.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Virtual Tour */}
            {property.hasVr === 1 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl mb-12">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <Image src="/virtual-tour.jpg" alt="Virtual Tour" fill className="object-cover" />
                <button className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-3 hover:bg-white transition-all">
                  <Users className="w-6 h-6 text-primarySite" />
                  <span className="font-semibold">Explore 3D Virtual Tour</span>
                </button>
              </motion.div>
            )}

            {/* Image Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {galleryImages.map((img, index) => (
                <motion.div key={index} whileHover={{ scale: 1.02 }} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer">
                  <Image src={img} alt="Property" fill className="object-cover" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Agent Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {property.agents.map((agent) => (
                <motion.div
                  key={agent.id}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedAgent?.id === agent.id
                      ? "border-primarySite bg-white/80 shadow-sm"
                      : "border-gray-200 hover:border-primarySite/30"
                  )}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <Image
                        src={agent.user.photo ?? "/agent_placeholder.webp"}
                        alt={agent.user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className={cn(poppins.className, "font-medium text-gray-800")}>
                        {agent.user.name}
                      </h3>
                      <p className="text-sm text-primarySite">
                        {agent.experience} years experience
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Combined Form */}
            {selectedAgent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              >
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Contact {selectedAgent.user.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAgent.agencyName && `${selectedAgent.agencyName} • `}
                    Speaks: {selectedAgent.languages.map(l => l.name).join(', ')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primarySite text-sm"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primarySite text-sm"
                      required
                    />
                    <textarea
                      placeholder="Message"
                      rows={3}
                      className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-primarySite text-sm"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      className="w-full bg-primarySite text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primarySite/90 transition-colors"
                    >
                      Send to {selectedAgent.user.name.split(' ')[0]}
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-xs text-gray-500">Or</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${selectedAgent.user.phone}`}
                        className="p-2 text-sm text-center text-primarySite border border-primarySite rounded-lg hover:bg-primarySite/5 transition-colors"
                      >
                        Call Directly
                      </a>
                      <button
                        type="button"
                        onClick={() => window.open("https://calendly.com/oussamaqqqq/house-tour-karim-el-mansouri", "_blank")}
                        className="p-2 text-sm text-center text-primarySite border border-primarySite rounded-lg hover:bg-primarySite/5 transition-colors"
                      >
                        Schedule Tour
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </div>

        </motion.div>
      </section>

      {/* Map Section */}
      <section className="h-[600px] bg-gray-100 relative">
        {property.location?.latitude && property.location?.longitude ? (
          <iframe
            width="100%"
            height="600"
            loading="lazy"
            className="border-0"
            src={`https://maps.google.com/maps?q=${property.location.latitude},${property.location.longitude
              }&z=15&output=embed`}
            allowFullScreen
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Location map not available</span>
          </div>
        )}
      </section>
    </div >
  );
};

export default PropertyShowcase;
