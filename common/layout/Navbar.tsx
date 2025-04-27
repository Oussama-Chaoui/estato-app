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
        w-full md:h-[75px] flex 
        items-center justify-center bg-white
        transition-all duration-300 ease-out
        ${isScrolled ? "shadow-sm md:h-[65px]" : "shadow-none"}
      `}
    >
      <div className="max-w-screen-2xl h-[41px] flex items-center justify-between sm:px-8 px-2 w-full">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link href="/">
            <Icon title="Estato" />
          </Link>
        </motion.div>

        <Navigation />
        <NavActions />

        <div className="flex gap-1 md:hidden">
          <Cart />
          <ResponsiveNavbar />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;