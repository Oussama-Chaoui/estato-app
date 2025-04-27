import Link from "next/link";
import { Heart, LucideIcon, User, LogIn } from "lucide-react";
import { Button } from "../../../ui/button";
import useAuth from "@/modules/auth/hooks/api/useAuth";
import Routes from "@/common/defs/routes";
import { motion } from "framer-motion";

const NavActions = () => {
  const { user, initialized } = useAuth();

  const actions: { icon: LucideIcon; label: string; href: string }[] = [
    {
      icon: initialized ? (user ? User : LogIn) : User,
      label: initialized ? (user ? "Profile" : "Login") : "Account",
      href: initialized ? (user ? Routes.Users.Me : Routes.Auth.Login) : "#",
    },
    {
      icon: Heart,
      label: "Favorites",
      href: "/favorites"
    },
  ];

  return (
    <div className="md:flex items-center xl:gap-6 lg:gap-1 hidden">
      {actions.map(({ icon: Icon, label, href }, i) => (
        <Link key={i} href={href} passHref>
          <Button
            variant="ghost"
            className="text-black font-medium text-base rounded-full relative"
            aria-label={label}
            disabled={!initialized && i === 0}
          >
            <motion.div
              key={String(initialized)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon />
            </motion.div>

            {i === 0 && !initialized && (
              <motion.div
                className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primarySite rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default NavActions;