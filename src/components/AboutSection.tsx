import React from 'react';
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

const AboutSection = () => {
  return (
    <div id="about" className='bg-black'>
      <h1 className='text-4xl text-center py-20 font-bold text-gray-900 dark:text-white'>
        About Cyber Defenders
      </h1>
      
      <div 
        className="
          flex 
          flex-col lg:flex-row
          justify-between 
          items-center 
          mx-auto 
          max-w-7xl 
          px-4 pb-20
        "
      >
        
        <CardContainer className="inter-var w-140 lg:mb-0 mb-10 mr-4">
          <CardBody className="
            bg-gray-50 relative group/card 
            
            dark:bg-gray-950 // Very dark background
            dark:hover:shadow-2xl dark:hover:shadow-cyan-400/[0.4] 
            dark:border-cyan-500/[0.4] border-black/[0.1] 
       
            w-full h-auto rounded-xl p-6 border 
            shadow-xl shadow-gray-700/20 dark:shadow-none
          ">
            <CardItem
              translateZ="50"
              className="text-4xl font-extrabold text-neutral-800 dark:text-cyan-400 mb-5" // Themed title color
            >
              MicroSOC Command Center
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-600 text-xl max-w-lg mt-4 dark:text-neutral-300"
            >
              We are the Tech Rangers of the Morphin Grid, forging a next-generation MicroSOC to defend against digital monsters. Our system detects attacks, analyzes threats in real time, and empowers Rangers with live dashboards, intelligent alerts, and incident control. From scanning to AI-powered detection, we safeguard the Command Center—one log at a time.
            </CardItem>
          </CardBody>
        </CardContainer>

        <div className="lg:w-2/5 w-full flex justify-center items-center p-6 lg:ml-4">
          <img 
            src="about_image.png"
            alt="About us illustration" 
            className="
              w-full 
              h-auto 
              object-cover 
              rounded-xl 
              shadow-2xl 
              shadow-cyan-500/50 
              transition-shadow 
              duration-500 
              hover:shadow-cyan-500/80
            " 
          />
        </div>
      </div>
    </div>
  )
}

export default AboutSection;