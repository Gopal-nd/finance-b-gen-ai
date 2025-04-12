"use client"

import { useState, useEffect } from "react"
import Link from "next/link"


import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { LogoutButton } from '@/components/Logout'
import { ModeToggle } from '@/components/ModeToggle'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

import React from 'react'


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
} = authClient.useSession() 

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])


  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const linkVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
            >
              FinGenAI
            </motion.div>
          </Link>

  

          {/* Mobile Menu Button */}
      
        {/* Mobile Menu */}
        <AnimatePresence>
                <motion.div variants={linkVariants} className="pt-2 flex flex-col space-y-3">
                {session?<Link href={'/dashboard'}> <Button >Dashboard</Button></Link>:<Link href={'/sign-in'}> <Button >Login</Button></Link>}
                
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      
    </motion.header>
  )
}
