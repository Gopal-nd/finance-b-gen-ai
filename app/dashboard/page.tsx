'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { 
  MessageSquare, 
  Mic, 
  Target, 
  Sparkles, 
  Calculator, 
  User, 
  BookOpen 
} from "lucide-react";

const products = [
  {
    name: "AI Chat",
    description: "Talk with your AI assistant anytime.",
    icon: <MessageSquare size={28} />,
    link: '/dashboard/chat',
  },
  {
    name: "Voice Chat",
    description: "Real-time voice interaction in native language powered by AI.",
    icon: <Mic size={28} />,
    link: '/dashboard/voice',
  },
  {
    name: "Goal Planning",
    description: "Stay focused and achieve your goals with smart tracking.",
    icon: <Target size={28} />,
    link: '/dashboard/goals',
  },
  {
    name: "Recommendations",
    description: "Get personalized suggestions with powerful algorithms.",
    icon: <Sparkles size={28} />,
    link: '/dashboard/recommend',
  },
  {
    name: "Calculator",
    description: "All Financial Calculators.",
    icon: <Calculator size={28} />,
    link: '/dashboard/calculators',
  },
  {
    name: "Learning",
    description: "AI-powered personalized learning paths.",
    icon: <BookOpen size={28} />,
    link: '/dashboard/learn',
  },
  {
    name: "Profiles",
    description: "Create and manage user profiles with ease.",
    icon: <User size={28} />,
    link: '/dashboard/account',
  },

];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    y: -8,
    scale: 1.03,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: [0, -5, 5, -3, 3, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

const ProductsShowcasePage = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  // Function to get appropriate accent color for each product based on theme
  const getAccentColor = (index:number) => {
    const accentColors = {
      0: isDark ? "bg-blue-950/30 border-blue-800/30" : "bg-blue-50 border-blue-200",
      1: isDark ? "bg-rose-950/30 border-rose-800/30" : "bg-rose-50 border-rose-200",
      2: isDark ? "bg-green-950/30 border-green-800/30" : "bg-green-50 border-green-200",
      3: isDark ? "bg-purple-950/30 border-purple-800/30" : "bg-purple-50 border-purple-200",
      4: isDark ? "bg-amber-950/30 border-amber-800/30" : "bg-amber-50 border-amber-200",
      5: isDark ? "bg-sky-950/30 border-sky-800/30" : "bg-sky-50 border-sky-200",
      6: isDark ? "bg-teal-950/30 border-teal-800/30" : "bg-teal-50 border-teal-200",
    };
    return accentColors[index % 7 as keyof typeof accentColors] || "";
  };

  // Function to get icon color based on theme and product index
  const getIconColor = (index:number) => {
    const iconColors = {
      0: isDark ? "text-blue-400" : "text-blue-600",
      1: isDark ? "text-rose-400" : "text-rose-600",
      2: isDark ? "text-green-400" : "text-green-600",
      3: isDark ? "text-purple-400" : "text-purple-600",
      4: isDark ? "text-amber-400" : "text-amber-600",
      5: isDark ? "text-sky-400" : "text-sky-600",
      6: isDark ? "text-teal-400" : "text-teal-600",
    };
    return iconColors[index % 7 as keyof typeof iconColors] || "";
  };

  return (
    <main className="px-6 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Products
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-muted-foreground">
            Discover our suite of intelligent tools designed to enhance your productivity and experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              variants={cardVariants}
              whileHover="hover"
              className="h-full"
            >
              <Link href={product.link} className="h-full block">
                <Card className={`h-full rounded-xl border transition-all duration-300 ${getAccentColor(index)}`}>
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <motion.div
                      variants={iconVariants}
                      className={`mb-6 p-4 rounded-full bg-background shadow-sm flex items-center justify-center ${getIconColor(index)}`}
                      style={{ width: '64px', height: '64px' }}
                    >
                      {product.icon}
                    </motion.div>
                    <h2 className="text-xl font-bold mb-3">{product.name}</h2>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="mt-auto pt-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`mt-4 inline-block px-4 py-2 rounded-full text-sm font-medium ${getIconColor(index)} border border-current/20`}
                      >
                        Explore
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default ProductsShowcasePage;