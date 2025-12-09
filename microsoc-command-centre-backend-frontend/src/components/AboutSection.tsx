import React from "react";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative w-full bg-black py-28 overflow-hidden"
    >
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:55px_55px]" />

      {/* CONTENT WRAPPER */}
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-20 lg:gap-32">

        {/* LEFT CARD */}
        <div
          className="
            w-full lg:w-[420px] 
            p-10 
            rounded-2xl 
            bg-black/60
            backdrop-blur-2xl
            border border-cyan-400/40
            shadow-[0_0_30px_rgba(0,255,255,0.35)]
            hover:shadow-[0_0_45px_rgba(0,255,255,0.55)]
            transition-all duration-300
          "
          style={{
            boxShadow:
              "0 0 20px rgba(0,255,255,0.25), inset 0 0 10px rgba(0,255,255,0.15)",
          }}
        >
          {/* Top glowing line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-t-xl"></div>

          <h2 className="text-4xl font-extrabold text-cyan-300 leading-tight mb-5">
            MicroSOC <br /> Command Center
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed">
            We are the Tech Rangers of the Morphin Grid, forging a next-generation
            MicroSOC to defend against digital monsters. Our system detects
            attacks, analyzes threats in real-time, and empowers Rangers with
            dashboards, alerts, and incident control — one log at a time.
          </p>
        </div>

        {/* GLOW SEPARATOR LINE */}
        <div className="hidden lg:block w-[2px] h-[520px] bg-gradient-to-b from-transparent via-cyan-500/60 to-transparent rounded-full shadow-[0_0_25px_rgba(0,255,255,0.4)]"></div>

        {/* RANGER IMAGE */}
        <div className="w-full lg:flex-1 flex justify-center">
          <img
            src="about_image.png"
            alt="Morphin Ranger"
            className="
              w-[420px] lg:w-[500px] 
              object-contain
              drop-shadow-[0_0_40px_rgba(0,255,255,0.4)]
              hover:drop-shadow-[0_0_60px_rgba(0,255,255,0.7)]
              transition-all duration-500
            "
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;