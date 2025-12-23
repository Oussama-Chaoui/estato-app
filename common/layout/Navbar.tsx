"use client";
import Link from "next/link";
import { Cart } from "../../components/common/partials/navbar/cart";
import Icon from "../../components/common/partials/navbar/icon";
import NavActions from "../../components/common/partials/navbar/nav-actions";
import Navigation from "../../components/common/partials/navbar/navigation";
import { ResponsiveNavbar } from "../../components/common/partials/navbar/responsive-navbar";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.div
      className={`
        fixed top-0 left-0 right-0 z-50 
        w-full transition-all duration-500 ease-out
        ${isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 h-16" 
          : "bg-gradient-to-r from-white via-gray-50/80 to-white backdrop-blur-sm h-20"
        }
      `}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0"
        >
          <Link href="/" className="flex items-center">
            <Icon />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <Navigation />
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <NavActions />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-2 lg:hidden">
          <Cart />
          <ResponsiveNavbar />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;