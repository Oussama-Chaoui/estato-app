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
import { ShoppingBasket } from "lucide-react";
import { Poppins } from "next/font/google";
import { motion } from "framer-motion";
import { useDirection } from "@/common/contexts/DirectionContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function Cart() {
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
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-all duration-200 relative"
          >
            <ShoppingBasket className="w-5 h-5" />
            {/* Cart badge */}
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              0
            </motion.div>
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} isRTL={isRTL} className="w-80 bg-white/95 backdrop-blur-md">
        <div className="w-full h-full flex flex-col pt-8">
          <SheetHeader className="mb-8">
            <SheetTitle className={cn("text-2xl font-bold text-gray-900", poppins.className)}>
              Shopping Cart
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBasket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-2">Add some properties to get started</p>
            </div>
          </div>
          
          <SheetFooter className="mt-auto pb-8">
            <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
              Continue Shopping
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
