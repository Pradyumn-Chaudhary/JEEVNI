"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter()
  const [isLogged, setisLogged] = useState(false)
  useEffect(() => {
    if (!isLogged) {
     router.push("/login")
   }
  }, [isLogged])
  return (
    <>
    
    </>
  );
}
