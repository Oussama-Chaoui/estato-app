import Link from "next/link";
import { Button } from "../../../ui/button";
import { Poppins } from "next/font/google";
import { cn } from "@/components/lib/utils/twMerge";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/listing", label: "Listings" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const poppins = Poppins({ subsets: ['latin'], weight: ["400", "500", "600", "700"] });

const Navigation = () => {
  return (
    <nav className="flex items-center space-x-1">
      {links.map(({ href, label }, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link href={href}>
            <Button 
              className={cn(
                poppins.className, 
                "relative text-gray-700 font-medium text-sm px-4 py-2 h-auto bg-transparent hover:bg-gray-50/50 hover:text-primary-600 transition-all duration-200 rounded-lg"
              )} 
              variant="ghost"
            >
              {label}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Button>
          </Link>
        </motion.div>
      ))}
    </nav>
  );
};

export default Navigation;
