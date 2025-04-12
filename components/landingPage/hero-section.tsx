"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useInView } from "react-intersection-observer"

export default function HeroSection() {
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
        delayChildren: 0.3,
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

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-16">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Invest smarter with your own{" "}
              <span className="text-emerald-600 dark:text-emerald-400">AI financial assistant</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0"
            >
              Ask questions, get personalized plans, and learn investing in your language.
            </motion.p>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-full px-8 py-6 text-lg font-medium"
                >
                Try Now
                <span className="ml-2">→</span>
              </Button>
                </Link>
            </motion.div>
          </div>

          <motion.div
            variants={imageVariants}
            className="flex-1 relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-500/20 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <img
                      src="/placeholder.svg?height=400&width=600"
                      alt="FinGenAI Demo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
