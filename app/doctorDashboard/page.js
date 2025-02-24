"use client";
import { fetchuser } from "@/actions/useraction";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return; // ✅ Ensure session is ready

      try {
        const u = await fetchuser(session.user.email);
        if (u?.isDoctor === "none") {
          router.push("/doctor");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status, router]); // ✅ Added dependencies

  return <div>I am doctor</div>;
};

export default Page;
