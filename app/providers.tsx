'use client'


import React,{ FC } from 'react'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
interface providersProps {
 children:React.ReactNode 
}

const Providers: FC<providersProps> = ({children}) => {
  const query = new QueryClient()
  return <>

<QueryClientProvider client={query}>
            {children}
</QueryClientProvider>
        
  </>
}

export default Providers