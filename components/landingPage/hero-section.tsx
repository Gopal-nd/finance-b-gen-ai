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

      
        </motion.div>
      </div>
    </section>
  )
}
