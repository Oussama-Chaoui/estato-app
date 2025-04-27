"use client";
import { useParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { cn } from "@/components/lib/utils/twMerge";
import { Bath, BedDouble, Expand, Heart, MapPin, Ruler, Users, Warehouse, Calendar, Home, TreePine, Car, ShieldCheck } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const fakeData = Array.from({ length: 20 }, (_, i) => {
  const priceValue = Math.floor(1200000 + Math.random() * 800000);
  return {
    id: i + 1,
    title: `Luxury Villa ${i + 1}`,
    description: `This stunning ${Math.floor(4 + Math.random() * 2)}-bedroom villa features exquisite modern architecture with premium finishes. Located in the heart of Casablanca's most exclusive neighborhood, this property offers ${Math.floor(200 + Math.random() * 200)}sqm of living space with panoramic sea views.`,
    detailedDescription: [
      "Designed by award-winning architect Amine El Kouhen",
      "Smart home automation system with climate control",
      "Infinity pool with integrated heating system",
      "Private beach access with security gate",
      "Landscaped gardens with native vegetation",
      "Home theater with Dolby Atmos surround sound",
      "Wine cellar with temperature control",
      "3-car garage with EV charging stations"
    ],
    price: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceValue),
    imageUrl: `/house_${(i % 5) + 1}.jpg`,
    images: [
      "/1.avif",
      "/2.avif",
      "/3.avif",
      "/4.avif",
      "/5.avif",
      "/6.avif",
    ],
    location: "Casablanca, Morocco",
    hasVR: i % 2 === 0,
    numericPrice: priceValue,
    yearBuilt: 2015 + (i % 5),
    lotSize: Math.floor(800 + Math.random() * 400),
    features: {
      bedrooms: Math.floor(3 + Math.random() * 3),
      bathrooms: Math.floor(2 + Math.random() * 2),
      area: Math.floor(2500 + Math.random() * 1000),
      garages: Math.floor(1 + Math.random() * 2)
    },
    amenities: [
      "Swimming Pool",
      "Smart Home System",
      "Security System",
      "Home Theater",
      "Wine Cellar",
      "Private Beach Access"
    ],
    priceHistory: [
      { year: 2020, price: 950000 },
      { year: 2021, price: 1100000 },
      { year: 2022, price: 1350000 },
      { year: 2023, price: 1550000 }
    ],
    agent: {
      name: "Karim El Mansouri",
      phone: "+212 612-345678",
      email: "karim@estato.com",
      photo: "/agent.jpg",
      experience: "12 years in luxury real estate"
    }
  };
});

const PropertyShowcase = () => {
  const { id } = useParams() as { id: string };
  const propertyId = Number(id);
  const [isLiked, setIsLiked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const property = useMemo(
    () => fakeData.find((item) => item.id === propertyId),
    [propertyId]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (property?.images.length || 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  if (!property) return <div className="text-center py-20 text-xl">Property not found</div>;

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 overflow-hidden">
          {property.images.map((img, index) => (
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
          className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl max-w-md"
        >
          <h1 className={cn(poppins.className, "text-4xl font-bold text-gray-900 mb-2")}>
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-primarySite mb-4">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{property.location}</span>
          </div>
          <div className="text-3xl font-bold text-primarySite mb-6">{property.price}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-primarySite text-white py-3 rounded-lg hover:bg-primarySite/90 transition-all font-semibold flex items-center justify-center gap-2"
            onClick={() => window.open("https://calendly.com/oussamaqqqq/house-tour-karim-el-mansouri", "_blank")}
          >
            <CalendarDays className="w-5 h-5" />
            Schedule Private Tour
          </motion.button>
        </motion.div>

        {/* Gallery Controls */}
        <div className="absolute bottom-8 right-8 flex gap-4">
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <Expand className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <Heart className={cn(
              "w-6 h-6 transition-colors",
              isLiked ? "text-primarySite fill-current" : "text-gray-800"
            )} />
          </button>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 px-8 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto"
        >
          {/* Main Content */}
          <div className="md:col-span-2">
            <h2 className={cn(poppins.className, "text-3xl font-bold text-gray-900 mb-8")}>
              {property.title} with Private Beach Access
            </h2>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {[
                { icon: <BedDouble className="w-6 h-6" />, label: `${property.features.bedrooms} Bedrooms` },
                { icon: <Bath className="w-6 h-6" />, label: `${property.features.bathrooms} Bathrooms` },
                { icon: <Ruler className="w-6 h-6" />, label: `${property.features.area} m²` },
                { icon: <Warehouse className="w-6 h-6" />, label: `${property.features.garages} Garages` },
                { icon: <Calendar className="w-6 h-6" />, label: `Built ${property.yearBuilt}` },
                { icon: <TreePine className="w-6 h-6" />, label: `${property.lotSize} sqm Lot` }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-2 bg-primarySite/10 rounded-lg text-primarySite">
                    {feature.icon}
                  </div>
                  <span className="font-medium">{feature.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="prose max-w-none mb-12"
            >
              <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>
              <div className="grid gap-4">
                {property.detailedDescription.map((desc, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primarySite flex-shrink-0" />
                    <span className="text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Price History Chart */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="bg-white p-6 rounded-xl shadow-sm mb-12"
            >
              <h3 className={cn(poppins.className, "text-xl font-bold mb-4")}>Price History</h3>
              <div className="flex gap-8 overflow-x-auto pb-4">
                {property.priceHistory.map((entry, i) => (
                  <div key={i} className="flex flex-col items-center min-w-[100px]">
                    <div className="h-24 w-1 bg-primarySite/20 relative">
                      <div
                        className="absolute bottom-0 w-full bg-primarySite transition-all duration-500"
                        style={{ height: `${(entry.price / property.numericPrice) * 80}%` }}
                      />
                    </div>
                    <div className="mt-2 text-sm font-medium">{entry.year}</div>
                    <div className="text-sm text-primarySite">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(entry.price)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Amenities Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="bg-white p-8 rounded-2xl shadow-xl mb-12"
            >
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
                    <span className="font-medium text-gray-800">{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Virtual Tour */}
            {property.hasVR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl mb-12"
              >
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
              {property.images.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                >
                  <Image src={img} alt="Property" fill className="object-cover" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm sticky top-20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image src={property.agent.photo} alt="Agent" fill className="object-cover" />
                </div>
                <div>
                  <h3 className={cn(poppins.className, "font-bold")}>{property.agent.name}</h3>
                  <p className="text-sm text-gray-600">{property.agent.experience}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primarySite"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primarySite"
                  required
                />
                <textarea
                  placeholder="Message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primarySite"
                  required
                />
                <div className="flex flex-col gap-4">
                  {/* Normal form submission button */}
                  <button
                    type="submit"
                    className="w-full bg-primarySite text-white py-3 rounded-lg transition-all font-semibold"
                  >
                    Submit Inquiry
                  </button>

                  {/* Divider */}
                  <div className="flex items-center">
                    <span className="flex-grow border-t border-gray-300"></span>
                    <span className="mx-4 text-sm text-gray-500 font-medium">or</span>
                    <span className="flex-grow border-t border-gray-300"></span>
                  </div>

                  {/* Booking button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white border-2 border-primarySite text-primarySite py-3 rounded-lg hover:bg-primarySite/5 transition-all font-semibold flex items-center justify-center gap-2"
                    onClick={() =>
                      window.open("https://calendly.com/oussamaqqqq/house-tour-karim-el-mansouri", "_blank")
                    }
                  >
                    <CalendarDays className="w-5 h-5" />
                    Book Immediate Viewing
                  </motion.button>
                </div>

              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Map Section */}
      <section className="h-[600px] bg-gray-100 relative">
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src="/map-placeholder.jpg"
              alt="Map"
              fill
              className="object-cover"
            />
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <MapPin className="w-12 h-12 text-primarySite drop-shadow-lg" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyShowcase;