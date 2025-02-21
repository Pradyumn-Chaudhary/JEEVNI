"use client"
import React from "react";
import Link from "next/link";

export default function Home() {
  
  return (
    <>
      Homepage
      <br />
      <br />
      <Link href="/login">
        <button>
        Login
      </button>
      </Link>
    </>
  );
}
