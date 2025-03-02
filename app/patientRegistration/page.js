"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/useraction";

const PatientRegistration = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    gender: "",
    isDoctor: "none",
  });

  useEffect(() => {
    if (form.isDoctor === "patient") {
      router.push("/patientDashboard");
    }
  }, [form.isDoctor, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.email) {
      getData();
    }
  }, [status, session]);

  const getData = async () => {
    if (!session?.user?.email) return;
    try {
      const userData = await fetchuser(session.user.email);
      setForm((prevForm) => ({
        ...prevForm,
        ...userData,
        isDoctor: userData.isDoctor || "none",
        image: userData.image || "",
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedForm = { ...form, isDoctor: "patient" , image: session?.user?.image};
      const result = await updateProfile(updatedForm, session.user.email);
      if (!result.success) {
        alert(result);
        return;
      }
      alert("Profile updated successfully!");
      router.push("/patientDashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Patient Registration</h2>
        <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold">Full Name</label>
            <input value={form.name || ""} onChange={handleChange} name="name" required className="w-full mt-1 p-2 border rounded-lg outline-indigo-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input value={form.email || ""} onChange={handleChange} name="email" disabled className="w-full mt-1 p-2 border rounded-lg outline-indigo-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Phone</label>
            <input value={form.phone || ""} onChange={handleChange} name="phone" required className="w-full mt-1 p-2 border rounded-lg outline-indigo-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Location</label>
            <input value={form.location || ""} onChange={handleChange} name="location" required className="w-full mt-1 p-2 border rounded-lg outline-indigo-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Gender</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="male" checked={form.gender === "male"} onChange={handleChange} /> Male
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="female" checked={form.gender === "female"} onChange={handleChange} /> Female
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="other" checked={form.gender === "other"} onChange={handleChange} /> Other
              </label>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="w-full mt-4 px-4 py-2 text-white font-bold bg-indigo-600 rounded-lg hover:bg-indigo-500 transition">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
