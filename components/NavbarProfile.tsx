'use client'

import Link from 'next/link'

import { ModeToggle } from './ModeToggle'
import UserAccounNav from './UserAccountNav'
import { authClient, useSession } from '@/lib/auth-client'

interface NavbarProfileProps {
  
}

const NavbarProfile= ({}) => {
    const {data:session} =  useSession()

  
    
  return (
    
    <div className="flex justify-end items-centerc  gap-2 md:gap-4">
          <ModeToggle />
          {session ? (
            <UserAccounNav user={session.user} />
            
          ) : (
            
              <Link href={"/login"} >
                Login
              </Link>
            
          )}
        </div>
    
  )
}

export default NavbarProfile
