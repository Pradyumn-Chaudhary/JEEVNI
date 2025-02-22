"use client"
import React,{useEffect,useState} from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"
import { fetchuser } from '@/actions/useraction'

const page = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState()
    useEffect(() => {
        if (!session) {
            router.push('/login')
      }
       // Fetch user only if session is available
    const fetchUserData = async () => {
      try {
        const u = await fetchuser(session.user.email);
        setUserData(u)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (session?.user?.email) {
      fetchUserData();
    }
    }, [session, router])
  
    useEffect(() => {
      // Redirect based on user type when userData is available
      if (userData) {
        if (userData.isDoctor === "doctor") {
          router.push("/doctorDashboard");
        } else if (userData.isDoctor === "user") {
          router.push("/userDashboard");
        }
      }
    }, [userData, router]); 
  
  return (
    <div>
      <div className='flex gap-7'>
      <button onClick={()=> router.push("/doctorDashboard")}>Doctor</button>
      <button onClick={()=>router.push("/userDashboard")}>User</button>
          </div>
          <br />
          <br />
    </div>
  )
}

export default page
