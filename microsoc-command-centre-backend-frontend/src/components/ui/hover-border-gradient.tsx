// ⭐ CHANGES ADDED:
// duration: 0.4  → faster rotation
// Additional keyframes added for smoother gradient morph
// Stronger highlight intensity

"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 0.4, // 🔥 FASTER ANIMATION SPEED
  clockwise = true,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (current: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const i = directions.indexOf(current);
    return clockwise
      ? directions[(i - 1 + directions.length) % directions.length]
      : directions[(i + 1) % directions.length];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(25% 60% at 50% 0%, white 0%, transparent 100%)",
    LEFT: "radial-gradient(25% 60% at 0% 50%, white 0%, transparent 100%)",
    BOTTOM:
      "radial-gradient(25% 60% at 50% 100%, white 0%, transparent 100%)",
    RIGHT:
      "radial-gradient(25% 60% at 100% 50%, white 0%, transparent 100%)",
  };

  // 🔥 STRONGER LIGHT EFFECT
  const highlight =
    "radial-gradient(90% 200% at 50% 50%, rgba(60,130,255,1) 0%, rgba(255,255,255,0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000); 
      return () => clearInterval(interval);
    }
  }, [hovered, duration]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border bg-black/20 hover:bg-black/10 transition duration-300 dark:bg-white/20 items-center p-px w-fit overflow-visible",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "z-10 bg-black text-white px-6 py-3 text-xl rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>

      <motion.div
        className="absolute inset-0 z-0 rounded-[inherit]"
        style={{ filter: "blur(4px)" }} 
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [
                movingMap[direction],
                highlight,
                movingMap[direction],
                highlight,
              ]
            : movingMap[direction],
        }}
        transition={{
          ease: "linear",
          duration: duration ?? 0.4,
          repeat: hovered ? Infinity : 0, 
        }}
      />

      <div className="bg-black absolute inset-[2px] rounded-[100px] z-1" />
    </Tag>
  );
}
