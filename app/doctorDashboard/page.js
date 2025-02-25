"use client";
import { fetchuser } from "@/actions/useraction";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return; // ✅ Ensure session is ready

      try {
        const u = await fetchuser(session.user.email);
        if (u?.isDoctor === "none") {
          router.push("/DoctorRegistration");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status, router]); // ✅ Added dependencies

  return (
    <div className="bg-gray-100">
      <div className="flex h-screen">

<div className="w-1/4 bg-white p-6 shadow-lg">
    <div className="text-center">
            <Image src="/avatar.png" alt="Profile Picture" className="mx-auto rounded-full" width="100" height="100"/>
        <h2 className="text-xl font-semibold mt-4">John Doe</h2>
        <p className="text-gray-600">johndoe@example.com</p>
    </div>
</div>


<div className="w-3/4 p-6">

    <div className="flex space-x-4 mb-4">
        <button id="appointment-tab" className="tab-btn bg-blue-500 text-white px-4 py-2 rounded">Appointment</button>
    </div>

   
    <div id="appointment-section" className="p-4 bg-white shadow rounded">
        <h2 className="text-lg font-semibold">Appointments</h2>
        <p>List of upcoming appointments...</p>
    </div>

    
</div>
</div>
    </div>
  )
 
};

export default Page;
