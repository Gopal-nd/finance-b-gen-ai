'use client'
import { LogoutButton } from "@/components/Logout"
import { authClient } from "@/lib/auth-client" // import the auth client
import React from 'react'

const DashBoardPage = () => {
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 
  return (
    <div>
        <p>DashBoardPage</p>
        <p>{JSON.stringify(session)}</p>
        <LogoutButton />
    </div>
  )
}

export default DashBoardPage


 