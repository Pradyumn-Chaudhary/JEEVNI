"use client";
import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/useraction";

const page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setform] = useState({});

  useEffect(() => {
    // console.log(session)

    if (!session) {
      router.push("/login");
    } else {
      getData();
    }
  }, []);

  const getData = async () => {
    let u = await fetchuser(session.user.email);
    setform(u);
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    let a = await updateProfile(e, session.user.name);
  };
  return (
    <div className="container mx-auto py-5 px-6 ">
      <h1 className="text-center my-5 text-3xl font-bold">
        Welcome to your Dashboard
      </h1>

      <form className="max-w-2xl mx-auto" action={handleSubmit}>
        <div className="my-2">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            value={form.name ? form.name : ""}
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        {/* input for email */}
        <div className="my-2">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            value={form.email ? form.email : ""}
            onChange={handleChange}
            readOnly={true}
            type="email"
            name="email"
            id="email"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="my-2">
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone
          </label>
          <input
            value={form.phone ? form.phone : ""}
            onChange={handleChange}
            readOnly={true}
            type="phone"
            name="phone"
            id="phone"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        
        <input type="hidden" name="isDoctor" value="user" />

        {/* Submit Button  */}
        <div className="my-6">
          <button
            type="submit"
            className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-blue-500 focus:ring-4 focus:outline-none   dark:focus:ring-blue-800 font-medium text-sm"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default page;
