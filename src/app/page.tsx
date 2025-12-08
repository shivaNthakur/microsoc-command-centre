"use client";
import AboutSection from "@/components/AboutSection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/NavBar";
import FeaturesSection from "@/components/FeaturesSection"
import FooterSection from "@/components/FooterSection"
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  return (
    <>
    <main className="min-h-screen">
      <Navbar></Navbar>
      <HeroSection></HeroSection>
    </main>
    <AboutSection></AboutSection>
    <FeaturesSection></FeaturesSection>
    <FooterSection></FooterSection>
    </>
  );
}
