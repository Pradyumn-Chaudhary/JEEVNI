"use client"
import React,{useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"

const page = () => {
    const { data: session, update } = useSession()
    const router = useRouter()
    useEffect(() => {
        if (!session) {
            router.push('/login')
        }
    }, [])
  return (
    <div>
          Hello
          <br />
          <br />
          <button onClick={() => signOut()}>Log out</button>
    </div>
  )
}

export default page
