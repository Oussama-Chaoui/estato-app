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
    <div className="md:flex items-center xl:gap-6 lg:gap-1 hidden">
      {actions.map(({ icon: Icon, label, href }, i) => (
        <div key={i}>
          {i === 1 && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-black font-medium text-base rounded-full relative"
                  aria-label={label}
                  disabled={!initialized}
                >
                  <motion.div
                    key={String(initialized)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon />
                  </motion.div>
                  {!initialized && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primarySite rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href={Routes.Users.Me} passHref>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    void logout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={href} passHref>
              <Button
                variant="ghost"
                className="text-black font-medium text-base rounded-full relative px-2"
                aria-label={label}
                disabled={!initialized && i === 1}
              >
                <motion.div
                  key={String(initialized)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon />
                </motion.div>
                {i === 1 && !initialized && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primarySite rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </Button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavActions;