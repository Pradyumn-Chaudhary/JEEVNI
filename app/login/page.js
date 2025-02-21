"use client";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState(false);
  const [doctor, setDoctor] = useState(false);
  const [role, setRole] = useState("");

  const handleDoctor = () => {
    setDoctor(true);
    setUser(false);
    setRole("doctor");
  };

  const handleUser = () => {
    setUser(true);
    setDoctor(false);
    setRole("user");
  };

  const handleSignIn = async (provider) => {
    if (role) {
      await signIn(provider, {
        callbackUrl: "/", // The URL to redirect to after successful login
        role: role, // Pass the selected role to NextAuth
      });
    } else {
      alert("Please select a role first.");
    }
  };

  return (
    <div className="flex flex-col gap-5 justify-center items-center m-auto h-screen">
      <div className="flex gap-5">
        <button className="bg-red-400" onClick={() => handleUser()}>
          User
        </button>
        <button className="bg-red-400" onClick={() => handleDoctor()}>
          Doctor
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {/* Disable buttons until either user or doctor is true */}
        <button
          onClick={() => handleSignIn("google")}
          disabled={!user && !doctor}
          className={!user && !doctor ? "opacity-50 cursor-not-allowed" : ""}
        >
          Google
        </button>
        <button
          onClick={() => handleSignIn("github")}
          disabled={!user && !doctor}
          className={!user && !doctor ? "opacity-50 cursor-not-allowed" : ""}
        >
          GitHub
        </button>
      </div>
    </div>
  );
};

export default Page;
