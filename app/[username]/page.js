"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addAppointment, fetchByUsername } from "@/actions/useraction";
import { useSession } from "next-auth/react";

const DoctorProfilePage = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [doctorData, setDoctorData] = useState({});
  const [paymentDiv, setPaymentDiv] = useState(false);
  const [paymentform, setpaymentform] = useState({});
  const [patientEmail, setpatientEmail] = useState();

  useEffect(() => {
    setpatientEmail(session?.user?.email);
    setpaymentform({
      doctorEmail: doctorData?.email,
      doctorName: doctorData?.name,
      patientEmail: patientEmail,
      patientName: "",
      problem: "",
      fees: doctorData?.fees,
    });
  }, [session, doctorData]);

  const handlechange = (e) => {
    setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };

  const handleAppointment = async() => {
    // console.log("working well");
    
    await addAppointment(
      paymentform.doctorEmail,
      paymentform.doctorName,
      paymentform.patientEmail,
      paymentform.patientName,
      paymentform.problem,
      paymentform.fees
    )
    router.push("/patientDashboard?appointmentDone=true")
  }

  useEffect(() => {
    const checkDoctor = async () => {
      const doctor = await fetchByUsername(params.username);
      if (!doctor) {
        router.replace("/notfound"); // Redirects to 404 page
      }
      setDoctorData(doctor);
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
            <h2 className="text-2xl font-semibold">{doctorData?.name}</h2>
            <p className="text-gray-600">{doctorData?.category}</p>
            <p className="text-gray-500">
              {doctorData?.experience}+ Years Experience
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Fees</h3>
          <p className="text-gray-600 mt-2">₹{doctorData?.fees}</p>
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
        <button
          onClick={() => setPaymentDiv(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-blue-600 transition"
        >
          Book Appointment
        </button>
      </div>
      {/* {console.log(session)} */}
      {/* {console.log(paymentform)}/ */}
      {/* Payment Div */}
      {paymentDiv && (
        <div className="w-[70%] h-[75%] absolute bottom-0 right-0 bg-gradient-to-br from-indigo-500 to-purple-600 p-10 rounded-xl text-white">
          <div className="flex gap-4 flex-col">
            <input
              name="patientName"
              onChange={handlechange}
              value={paymentform.patientName}
              type="text"
              placeholder="Enter name"
              className="bg-gray-800 text-white rounded-xl w-full p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              maxLength={24}
            />
            <input
              name="problem"
              onChange={handlechange}
              value={paymentform.problem}
              type="text"
              placeholder="Enter problem"
              className="bg-gray-800 text-white rounded-xl w-full p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              maxLength={100}
            />
            <span className="text-xs text-gray-300">
              *All fields are required
            </span>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleAppointment}
              className="text-white bg-gradient-to-r from-green-400 to-teal-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full disabled:opacity-50"
              disabled={
                paymentform.patientName.length === 0 ||
                paymentform.problem.length === 0
              }
            >
              Pay ₹{doctorData?.fees}
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => setPaymentDiv(false)}
              className="bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfilePage;
