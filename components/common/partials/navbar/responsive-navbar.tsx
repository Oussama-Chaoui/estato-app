"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/components/lib/utils/twMerge";
import { MenuIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDirection } from "@/common/contexts/DirectionContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/listing", label: "Listings" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/favorites", label: "Favorites" },
  { href: "/profile", label: "Profile" },
];

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function ResponsiveNavbar() {
  const { isRTL } = useDirection();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-all duration-200"
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} isRTL={isRTL} className="w-80 bg-white/95 backdrop-blur-md">
        <div className="w-full h-full flex flex-col pt-8">
          <SheetHeader className="mb-8">
            <SheetTitle className={cn("text-2xl font-bold text-gray-900", poppins.className)}>
              Menu
            </SheetTitle>
          </SheetHeader>
          
          <nav className="flex-1">
            <div className="space-y-2">
              {links.map(({ href, label }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link href={href}>
                    <Button
                      className={cn(
                        poppins.className,
                        "w-full justify-start text-left text-gray-700 hover:text-primary-600 hover:bg-gray-50/50 font-medium text-base py-4 px-4 rounded-lg transition-all duration-200"
                      )}
                      variant="ghost"
                    >
                      {label}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </nav>
          
          <SheetFooter className="mt-auto pb-8">
            <div className="w-full text-center">
              <p className="text-sm text-gray-500">
                © 2024 Real Estate. All rights reserved.
              </p>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
