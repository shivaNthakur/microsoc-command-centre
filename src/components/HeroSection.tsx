"use client";
import React from 'react';
import { WavyBackground } from "@/components/ui/wavy-background";
import { HoverBorderGradient } from './ui/hover-border-gradient';
const HeroSection = () => {
  return (
    <>
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
           Blue <span className='text-blue-700'>Ranger</span>
        </p>
        <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center text-2xl">
          Guardian of the Grid, Defender of the Server Realm.
        </p>
        <p className="text-base md:text-lg mt-2 text-white font-normal inter-var text-center">
          With MicroSOC at his command, the Blue Ranger scans every port, hunts every intrusion, analyzes every suspicious pattern, and shields the Morphin Grid from evolving cyber threats—keeping the Ranger systems resilient, fortified, and unbreakable.
        </p>

      </WavyBackground>
      <div className="w-full flex justify-center -mt-40">
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="
      dark:bg-black bg-white 
      text-black dark:text-white 
      flex items-center justify-center
      space-x-2 
      px-8 py-4 
      text-xl font-semibold 
      rounded-full
    "
        >
          Power Ranger
        </HoverBorderGradient>
      </div>

    </>
  )
}

export default HeroSection