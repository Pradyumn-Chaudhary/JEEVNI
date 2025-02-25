"use client"
import React, { useEffect } from "react";
import { useParams ,useRouter} from "next/navigation";
import { fetchByUsername } from "@/actions/useraction";

const DoctorProfilePage = () => {
  const params = useParams();
  const router = useRouter()

  useEffect(() => {
    const checkDoctor = async () => {
      const doctor = await fetchByUsername(params.username);
      console.log(doctor);
      
      if (!doctor) {
        router.replace("/notfound");  // Redirects to 404 page
      }
    };

    checkDoctor();
  }, [params.username]); 
  
  
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <div className="w-[95%] m-auto my-5">
        {/* Main Content Area */}
        <div className="flex items-center space-x-6">
          <img
            src="/avatar.png"
            alt="Dr. John Smith's Profile Picture"
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-semibold">Dr. John Smith</h2>
            <p className="text-gray-600">Cardiologist</p>
            <p className="text-gray-500">10+ Years Experience</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">About</h3>
          <p className="text-gray-600 mt-2">
            Dr. John Smith is a highly experienced cardiologist specializing in
            heart diseases and treatments. He has helped thousands of patients
            recover and live healthier lives.
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-gray-600 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit...
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <p className="text-gray-600">📞 +1 234 567 890</p>
          <p className="text-gray-600">📍 New York, USA</p>
        </div>
      </div>

      {/* Fixed Footer with Appointment Button */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-center">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-blue-600 transition">
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
