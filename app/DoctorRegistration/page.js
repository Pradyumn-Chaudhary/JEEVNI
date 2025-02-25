"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/useraction";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    location: "",
    gender: "",
    qualification: "",
    experience: "",
    category: "",
    fees: "",
    razorpayid: "",
    razorpaysecret: "",
    isDoctor: "",
  });

  useEffect(() => {
    if (form.isDoctor === "doctor") {
      router.push("/doctorDashboard"); // ✅ Prevent access to registration
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
      console.log("Fetched user data:", userData); // Debug log
      setForm((prevForm) => ({
        ...prevForm,
        ...userData,
        isDoctor: userData.isDoctor || "none",// ✅ Ensure "doctor" is always set
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "experience" || name === "fees" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedForm = { ...form, isDoctor: "doctor" };
      const result = await updateProfile(updatedForm, session.user.email);
      console.log("Update result:", result);
      alert("Profile updated successfully!");

      // ✅ Redirect to doctorDashboard after successful update
      router.push("/doctorDashboard");
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Doctor Registration
        </h2>

        <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold">
              Full Name
            </label>
            <input
              value={form.name || ""}
              onChange={handleChange}
              id="name"
              type="text"
              name="name"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Username
            </label>
            <input
              value={form.username || ""}
              onChange={handleChange}
              id="username"
              type="text"
              name="username"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              value={form.email || ""}
              onChange={handleChange}
              id="email"
              type="email"
              name="email"
              required
              disabled
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Phone</label>
            <input
              value={form.phone || ""}
              onChange={handleChange}
              id="phone"
              type="tel"
              name="phone"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Location
            </label>
            <input
              value={form.location || ""}
              onChange={handleChange}
              id="location"
              type="text"
              name="location"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Gender</label>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={form.gender === "male"}
                  onChange={handleChange}
                  className="text-indigo-600"
                />
                Male
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={form.gender === "female"}
                  onChange={handleChange}
                  className="text-indigo-600"
                />
                Female
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={form.gender === "other"}
                  onChange={handleChange}
                  className="text-indigo-600"
                />
                Other
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Qualification
            </label>
            <select
              name="qualification"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
              value={form.qualification || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Qualification
              </option>
              <option value="MBBS">MBBS</option>
              <option value="MD">MD</option>
              <option value="MS">MS</option>
              <option value="BDS">BDS</option>
              <option value="BHMS">BHMS</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Experience (Years)
            </label>
            <input
              value={form.experience || ""}
              onChange={handleChange}
              id="experience"
              type="number"
              name="experience"
              min="0"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Specialization
            </label>
            <select
              name="category"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
              value={form.category || ""}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Specialization
              </option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Consultation Fees (₹)
            </label>
            <input
              value={form.fees || ""}
              onChange={handleChange}
              id="fees"
              type="number"
              name="fees"
              min="0"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Razorpay ID
            </label>
            <input
              value={form.razorpayid || ""}
              onChange={handleChange}
              id="razorpayid"
              type="text"
              name="razorpayid"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Razorpay Secret
            </label>
            <input
              value={form.razorpaysecret || ""}
              onChange={handleChange}
              id="razorpaysecret"
              type="password"
              name="razorpaysecret"
              required
              className="w-full mt-1 p-2 border rounded-lg outline-indigo-500"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 text-white font-bold bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
