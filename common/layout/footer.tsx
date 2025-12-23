"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Linkedin, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const links = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Luxury Villas" },
  { href: "/about", label: "Our Agents" },
  { href: "/contact", label: "Consultation" },
];

const helps = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Investment Guide" },
  { href: "/faq", label: "VIP Services" },
];

const Footer = () => {
  return (
    <footer
      className={cn(
        poppins.className,
        "w-full md:px-16 px-10 md:py-12 py-6 flex items-center justify-center bg-[#fafafa] border-t border-[#B88E2F]/20 relative overflow-hidden"
      )}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="pattern-dots pattern-[#B88E2F] pattern-opacity-20 pattern-size-4 w-full h-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full flex flex-col gap-y-10 relative z-10"
      >
        {/* Top Section */}
        <div className="w-full grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-y-6">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold bg-gradient-to-r from-[#B88E2F] to-[#D4A946] bg-clip-text text-transparent"
            >
              Yakout.
            </motion.h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Premium real estate listings designed for elegance and quality living.
            </p>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4 text-primarySite" />
              <p className="text-sm">400 Avenue Hassan II, Casablanca</p>
            </div>
            <div className="flex gap-4 mt-4">
              <motion.button whileHover={{ y: -2 }} className="p-2 rounded-full bg-[#B88E2F]/10 hover:bg-[#B88E2F]/20 transition">
                <Instagram className="w-5 h-5 text-[#B88E2F]" />
              </motion.button>
              <motion.button whileHover={{ y: -2 }} className="p-2 rounded-full bg-[#B88E2F]/10 hover:bg-[#B88E2F]/20 transition">
                <Facebook className="w-5 h-5 text-[#B88E2F]" />
              </motion.button>
              <motion.button whileHover={{ y: -2 }} className="p-2 rounded-full bg-[#B88E2F]/10 hover:bg-[#B88E2F]/20 transition">
                <Linkedin className="w-5 h-5 text-[#B88E2F]" />
              </motion.button>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-primarySite pl-3">Discover</h3>
              {links.map(({ href, label }, index) => (
                <motion.div key={index} whileHover={{ x: 5 }}>
                  <Link href={href}>
                    <Button
                      className={cn(
                        "text-gray-700 font-medium text-sm pl-0 hover:text-primarySite transition-all justify-start"
                      )}
                      variant={"link"}
                    >
                      {label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-primarySite pl-3">Services</h3>
              {helps.map(({ href, label }, index) => (
                <motion.div key={index} whileHover={{ x: 5 }}>
                  <Link href={href}>
                    <Button
                      className={cn(
                        "text-gray-700 font-medium text-sm pl-0 hover:text-primarySite transition-all justify-start"
                      )}
                      variant={"link"}
                    >
                      {label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col gap-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-primarySite pl-3">Insights</h3>
            <p className="text-sm text-gray-600">
              Get exclusive market reports and premium listings
            </p>
            <div className="flex flex-col w-full gap-3">
              <Input
                type="email"
                placeholder="Your email"
                className="text-sm border-gray-300 focus:border-primarySite focus:ring-1 focus:ring-primarySite"
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-gradient-to-r from-[#B88E2F] to-[#D4A946] text-white hover:opacity-90 transition-all">
                  Subscribe
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="w-full flex flex-col md:flex-row justify-between items-center pt-6 border-t border-[#B88E2F]/20 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <p>© {new Date().getFullYear()} Yakout. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms-of-service">
              <motion.span whileHover={{ color: "#B88E2F" }} className="cursor-pointer">
                Terms of Service
              </motion.span>
            </Link>
            <Link href="/privacy-policy">
              <motion.span whileHover={{ color: "#B88E2F" }} className="cursor-pointer">
                Privacy Policy
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;