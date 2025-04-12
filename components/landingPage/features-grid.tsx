"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { MessageSquare, Mic, Calculator, ShoppingBag, Globe, Shield } from "lucide-react"

const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-emerald-600" />,
    title: "AI Chat",
    description: "Ask any financial question and get instant expert answers.",
  },
  {
    icon: <Mic className="h-8 w-8 text-emerald-600" />,
    title: "Voice Input/Output",
    description: "Speak your questions and listen to responses in your language.",
  },
  {
    icon: <Calculator className="h-8 w-8 text-emerald-600" />,
    title: "SIP Planner",
    description: "Set financial goals and get customized SIP recommendations.",
  },
  {
    icon: <ShoppingBag className="h-8 w-8 text-emerald-600" />,
    title: "Product Recommender",
    description: "Discover personalized investment products that match your needs.",
  },
  {
    icon: <Globe className="h-8 w-8 text-emerald-600" />,
    title: "Regional Languages",
    description: "Learn and interact in 10+ Indian languages for better understanding.",
  },
  {
    icon: <Shield className="h-8 w-8 text-emerald-600" />,
    title: "Secure Platform",
    description: "Bank-grade security to keep your financial data safe and private.",
  },
]

export default function FeaturesGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Your Financial Journey
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to make smarter financial decisions in one place
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
