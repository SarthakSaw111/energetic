import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/workout", icon: Dumbbell, label: "Workout" },
  { path: "/meals", icon: UtensilsCrossed, label: "Meals" },
  { path: "/progress", icon: TrendingUp, label: "Progress" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-800/90 backdrop-blur-xl border-t border-dark-500/30 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-brand-orange/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={`transition-colors duration-200 ${
                  isActive ? "text-brand-orange" : "text-gray-500"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-brand-orange" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
