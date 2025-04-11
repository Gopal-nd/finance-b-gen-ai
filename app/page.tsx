'use client'
import { LogoutButton } from '@/components/Logout'
import { ModeToggle } from '@/components/ModeToggle'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import React from 'react'

const HomePage = () => {

  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
} = authClient.useSession() 
  return (
    <div>
      <ModeToggle />
      <Button>let's Start </Button>
      <p>{JSON.stringify(session)}</p>
      {session?<Link href={'/dashboard'}> <Button >Dashboard</Button></Link>:<Link href={'/sign-in'}> <Button >Logi</Button></Link>}
     { session  &&<LogoutButton />}
    </div>
  )
}

export default HomePage