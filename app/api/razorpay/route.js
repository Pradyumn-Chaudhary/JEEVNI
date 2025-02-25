import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // Adjust path as needed
import User from "@/models/User"; // Adjust path as needed
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

export const POST = async (req) => {
  try {
    await connectDB();

    let body = await req.formData();
    body = Object.fromEntries(body);
    console.log("Payment callback body:", body);

    // Fetch the user (doctor) based on the order ID in their appointments
    let doctor = await User.findOne({
      "appointments.appointmentId": body.razorpay_order_id,
    });
    console.log("Doctor found:", doctor);

    if (!doctor) {
      return NextResponse.json({
        success: false,
        message: "Order ID not found in doctor appointments",
      });
    }

    // Fetch the secret from the database
    const secret = doctor.razorpaysecret;
    if (!secret) {
      throw new Error("Razorpay secret not found for this doctor");
    }

    // Verify the payment signature
    let isVerified = validatePaymentVerification(
      {
        order_id: body.razorpay_order_id,
        payment_id: body.razorpay_payment_id,
      },
      body.razorpay_signature,
      secret
    );
    console.log("Payment verification result:", isVerified);

    if (isVerified) {
      // Update payment status in the doctor's appointments
      await User.updateOne(
        { "appointments.appointmentId": body.razorpay_order_id },
        { $set: { "appointments.$.paymentDone": true } }
      );

      // Update payment status in the patient's appointments
      await User.updateOne(
        { "appointments.appointmentId": body.razorpay_order_id },
        { $set: { "appointments.$.paymentDone": true } }
      );

      console.log("Payment status updated successfully");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/patientDashboard?paymentdone=true`
      );
    } else {
      return NextResponse.json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};