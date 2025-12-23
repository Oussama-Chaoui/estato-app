import Link from "next/link";
import { Heart, UserCircle, LogIn, User, LogOut } from "lucide-react";
import { Button } from "../../../ui/button";
import useAuth from "@/modules/auth/hooks/api/useAuth";
import Routes from "@/common/defs/routes";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavActions = () => {
  const { user, initialized, logout } = useAuth();

  const actions: { icon: React.ElementType; label: string; href: string }[] = [
    {
      icon: Heart,
      label: "Favorites",
      href: "/favorites"
    },
    {
      icon: initialized ? (user ? UserCircle : LogIn) : UserCircle,
      label: initialized ? (user ? "Account" : "Login") : "Account",
      href: initialized ? (user ? "#" : Routes.Auth.Login) : "#",
    },
  ];

  return (
    <div className="flex items-center space-x-3">
      {actions.map(({ icon: Icon, label, href }, i) => (
        <div key={i}>
          {i === 1 && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className="relative w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-all duration-200"
                    aria-label={label}
                    disabled={!initialized}
                  >
                    <motion.div
                      key={String(initialized)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    {!initialized && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 w-2 h-2 bg-primary-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-2">
                <Link href={Routes.Users.Me} passHref>
                  <DropdownMenuItem className="cursor-pointer py-3">
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="font-medium">Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="cursor-pointer py-3 text-red-600 hover:text-red-700"
                  onClick={() => {
                    void logout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <span className="font-medium">Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={href} passHref>
                <Button
                  variant="ghost"
                  className="relative w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-all duration-200"
                  aria-label={label}
                  disabled={!initialized && i === 1}
                >
                  <motion.div
                    key={String(initialized)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  {i === 1 && !initialized && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-2 h-2 bg-primary-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavActions;