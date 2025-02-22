"use client";
import React from "react";
import Link from "next/link";
import { useSession,signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession(); // Get session data

  return (
    <>
      Homepage
      <br />
      <Link href="/Profile">
      <button>
        Profile
        </button>
      </Link>
      <br />
      <br />
      {!session ? (
        <Link href="/login">
          <button>Login</button>
        </Link>
      ) : (
        <button onClick={() => signOut({ callbackUrl: "/" })}>Log out</button>
      )}
    </>
  );
}
