import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jeevni - Smart Healthcare & Wellness App",
  description:
    " Jeevni is an innovative healthcare platform designed to connect patients with doctors through seamless video consultations. It offers features like real-time doctor availability, secure video calls, AI-powered health insights, and a reward system for regular health checkups. With integrated medicine delivery and health monitoring, Jeevni ensures a hassle-free and accessible healthcare experience for all.",

  keywords: [
    // General Healthcare
    "healthcare app",
    "smart healthcare solutions",
    "digital health app",
    "best healthcare app",
    "health and wellness",
    "AI healthcare solutions",
    "digital healthcare services",
    "online health app",
    "health tracker app",
    "personalized health insights",
    "patient health monitoring",
    "e-health platform",
    "remote patient monitoring",
    "best health monitoring app",

    // Telemedicine & Online Consultations
    "telemedicine platform",
    "online doctor consultation",
    "doctor consultation app",
    "video consultation",
    "virtual doctor visit",
    "best telehealth app",
    "doctor on-demand",
    "online medical advice",
    "24/7 doctor consultation",
    "telehealth for elderly",
    "affordable healthcare online",
    "instant doctor appointment",
    "top telemedicine service",
    "online hospital consultation",
    "telehealth app for India",
    "digital doctor consultation",

    // Doctor Appointment & Patient Management
    "doctor appointment booking",
    "schedule doctor appointment",
    "patient health reports",
    "medical appointment booking system",
    "doctor availability checker",
    "patient-doctor chat",
    "secure doctor chat app",
    "medical records management",
    "e-prescription service",
    "chronic disease management",
    "AI-powered symptom checker",
    "hospital management software",

    // Medicine Delivery & Pharmacy Integration
    "medicine delivery",
    "online pharmacy app",
    "buy medicine online",
    "prescription delivery app",
    "best medicine delivery service",
    "drug delivery platform",
    "pharmacy home delivery",
    "order medicines online",
    "fast medicine delivery service",
    "healthcare e-commerce",

    // AI-Powered Health Insights
    "AI health insights",
    "health AI assistant",
    "AI doctor consultation",
    "AI-driven health tracking",
    "AI symptom checker",
    "best AI health app",
    "smart AI doctor app",
    "automated health diagnosis",
    "predictive healthcare analytics",
    "personalized health AI",

    // Wellness & Preventive Healthcare
    "fitness and wellness",
    "health and fitness tracking",
    "mental health counseling",
    "stress management app",
    "mental health therapy app",
    "yoga and meditation app",
    "digital wellness solutions",
    "preventive healthcare services",
    "best wellness app",

    // Emergency & Specialized Healthcare
    "emergency doctor consultation",
    "urgent medical advice",
    "emergency telehealth services",
    "ambulance booking app",
    "cardiology consultation online",
    "dermatology consultation app",
    "online pediatric consultation",
    "gynecology consultation online",
    "telemedicine for chronic disease",
    "best online therapy platforms",
  ].join(", "),

  author: "Pradyumn Chaudhary, Jeevni Team",
  viewport: "width=device-width, initial-scale=1",

  openGraph: {
    title: "Jeevni - Smart Healthcare & Wellness App",
    description:
      "Jeevni is an AI-powered healthcare platform for online doctor consultations, real-time health monitoring, and medicine delivery. Get instant medical advice from top doctors through secure video calls.",

    url: "https://jeevni-beta.vercel.app", // Your actual website URL
    type: "website",

    image: "https://jeevni-beta.vercel.app/banner.jpg", // High-quality preview image (1200x630px recommended)
    imageWidth: 1200, // Recommended width
    imageHeight: 630, // Recommended height

    site_name: "Jeevni",
    locale: "en_IN", // Set the default language (e.g., "en_IN" for India)

    // Additional OG tags for better previews
    imageAlt:
      "Jeevni - Smart Healthcare & Wellness App | Video Consultations, AI Health Insights, Medicine Delivery",
    determiner: "the", // Helps refine the site's reference (optional)
  },

  robots: "index, follow", // Allows search engines to index and follow links
  canonical: "https://jeevni-beta.vercel.app", // Canonical URL for SEO
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
