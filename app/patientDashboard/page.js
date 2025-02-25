"use client";
import { fetchuser } from "@/actions/useraction";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const PatientDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [patientData, setPatientData] = useState({});
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      try {
        const user = await fetchuser(session.user.email);
        setPatientData(user);
        if (user?.isDoctor === "none") {
          router.push("/patientRegistration");
        } else if (user?.isDoctor === "doctor") {
          router.push("/DoctorDashboard");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="bg-gray-100">
      <div className="flex h-screen">
        {console.log(patientData)}
        <div className="w-1/4 bg-white p-6 shadow-lg flex flex-col justify-between">
          <div className="text-center">
            <Image
              src="/avatar.png"
              alt="Profile Picture"
              className="mx-auto rounded-full"
              width={100}
              height={100}
            />
            <h2 className="text-2xl font-semibold mt-4">{patientData?.name}</h2>
            <p className="text-gray-600">{patientData?.email}</p>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-gray-800 font-medium">
              Age: <span className="text-gray-600">{patientData?.age}</span>
            </p>
            <p className="text-gray-800 font-medium">
              Gender:{" "}
              <span className="text-gray-600">{patientData?.gender}</span>
            </p>
            <p className="text-gray-800 font-medium">
              Phone: <span className="text-gray-600">{patientData?.phone}</span>
            </p>
            <p className="text-gray-800 font-medium">
              Location:{" "}
              <span className="text-gray-600">{patientData?.location}</span>
            </p>
            <p className="text-gray-800 font-medium">
              Medical History:{" "}
              <span className="text-gray-600">
                {patientData?.medicalHistory}
              </span>
            </p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="w-3/4 p-6">
          <div className="flex space-x-4 mb-4">
            <button
              className={`tab-btn px-4 py-2 rounded ${
                activeTab === "appointments"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("appointments")}
            >
              My Appointments
            </button>
            <button
              className={`tab-btn px-4 py-2 rounded ${
                activeTab === "history"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </div>

          {activeTab === "appointments" ? (
            <div className="p-4 bg-white shadow rounded">
              <h2 className="text-lg font-semibold mb-2">Appointments</h2>
              {patientData?.appointments?.length === 0 ? (
                <p className="text-gray-500">No upcoming appointments</p>
              ) : (
                <div className="space-y-4">
                  {patientData?.appointments?.map((appointment) => (
                    <div
                      key={appointment.appointmentId}
                      className="p-4 border rounded-lg shadow-sm flex justify-between items-center bg-white"
                    >
                      <div>
                        <p className="text-md font-medium">
                          👨‍⚕️ Doctor: {appointment.doctorName}
                        </p>
                        <p className="text-gray-600">
                          🗓 Date: {appointment.date}
                        </p>
                        <p className="text-gray-600">
                          💰 Fees: ₹{appointment.amount}
                        </p>
                      </div>
                      <div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition">
                          📞 Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-white shadow rounded">
              <h2 className="text-lg font-semibold mb-2">History</h2>
              {patientData?.history?.length === 0 ? (
                <p className="text-gray-500">No past appointments</p>
              ) : (
                <div className="space-y-4">
                  {patientData?.history?.map((history) => (
                    <div
                      key={history.historyId}
                      className="p-4 border rounded-lg shadow-sm bg-white"
                    >
                      <p className="text-md font-medium">
                        👨‍⚕️ Doctor: {history.doctorName}
                      </p>
                      <p className="text-gray-600">🗓 Date: {history.date}</p>
                      <p className="text-gray-600">
                        💊 Diagnosis: {history.diagnosis}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
