"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const demoItems = [
  {
    title: "AI Chat Interface",
    description: "Ask any financial question and get instant expert answers",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Voice Input & Output",
    description: "Speak your questions and listen to responses in your language",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "SIP Goal Planner",
    description: "Set financial goals like ₹5L in 3 years with custom SIP plans",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Learning & Quiz Module",
    description: "Build your financial knowledge with interactive lessons",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Multilingual Support",
    description: "Use FinGenAI in 10+ Indian languages for better understanding",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function ProductDemo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === demoItems.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? demoItems.length - 1 : prevIndex - 1))
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollAmount = currentIndex * scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }, [currentIndex])

  return (
    <section id="demo" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">See FinGenAI in Action</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore how our AI assistant makes financial planning simple and accessible
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative"
        >
          <div ref={scrollContainerRef} className="overflow-x-hidden relative">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                width: `${demoItems.length * 100}%`,
                transform: `translateX(-${(currentIndex * 100) / demoItems.length}%)`,
              }}
            >
              {demoItems.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                    <div className="aspect-video relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-700/90 z-10 rounded-full h-12 w-12 shadow-md"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-700/90 z-10 rounded-full h-12 w-12 shadow-md"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </motion.div>

          <div className="flex justify-center mt-6 space-x-2">
            {demoItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-emerald-600 dark:bg-emerald-400" : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
