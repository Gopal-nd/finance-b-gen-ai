"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote:
      "FinGenAI helped me understand mutual funds in Hindi. Now I'm confidently investing for my daughter's education.",
    name: "Priya Sharma",
    location: "Delhi",
    emoji: "👩‍👧",
  },
  {
    quote: "I set a goal to save ₹10L in 5 years. FinGenAI created a SIP plan that fits my budget perfectly!",
    name: "Rahul Patel",
    location: "Mumbai",
    emoji: "🏠",
  },
  {
    quote:
      "As a first-time investor, the learning modules in Tamil helped me understand the basics of the stock market.",
    name: "Karthik Rajan",
    location: "Chennai",
    emoji: "📚",
  },
]

export default function Testimonials() {
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
    hidden: { y: 30, opacity: 0 },
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
    <section id="testimonials" className="py-20 bg-emerald-50 dark:bg-emerald-950/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of Indians who are transforming their financial future
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Card className="h-full bg-white dark:bg-gray-800 border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{testimonial.emoji}</div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.location}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
