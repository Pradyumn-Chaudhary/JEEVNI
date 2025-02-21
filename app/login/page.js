"use client";
import React, { useEffect,useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const hasRedirected = useRef(false);
  const { data: session, status } = useSession();
  const router = useRouter();
   useEffect(() => {
    if (status === "authenticated" && !hasRedirected.current) {
      router.push("/Profile");
      hasRedirected.current = true;
    }
  }, [status, router]);

  return (
    <div className="flex flex-col gap-5 justify-center items-center m-auto h-screen">
        <button
          onClick={() => signIn("google")}
        >
          Google
        </button>
        <button
          onClick={() => signIn("github")}
        >
          GitHub
        </button>
    </div>
  );
};

export default Page;
