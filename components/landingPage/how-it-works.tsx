"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Settings, MessageSquare, LineChart, BookOpen, RefreshCw } from "lucide-react"

const steps = [
  {
    icon: <Settings className="h-8 w-8 text-emerald-600" />,
    title: "Setup",
    description: "Create your account and set your financial preferences",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-emerald-600" />,
    title: "Ask",
    description: "Ask questions about investing or your financial goals",
  },
  {
    icon: <LineChart className="h-8 w-8 text-emerald-600" />,
    title: "Get Plan",
    description: "Receive personalized investment plans and recommendations",
  },
  {
    icon: <BookOpen className="h-8 w-8 text-emerald-600" />,
    title: "Learn",
    description: "Build your knowledge with interactive lessons and quizzes",
  },
  {
    icon: <RefreshCw className="h-8 w-8 text-emerald-600" />,
    title: "Repeat",
    description: "Track progress and adjust your plans as needed",
  },
]

export default function HowItWorks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How FinGenAI Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your journey to financial freedom in five simple steps
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative"
        >
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-emerald-100 dark:bg-emerald-900/50 -translate-y-1/2 z-0"></div>

          <div className="flex flex-col md:flex-row justify-between relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center text-center mb-8 md:mb-0"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 border-4 border-emerald-100 dark:border-emerald-900/50 rounded-full p-4 mb-4"
                >
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full">{step.icon}</div>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-[200px]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
