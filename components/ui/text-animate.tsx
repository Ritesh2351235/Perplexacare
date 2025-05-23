"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ElementType, memo } from "react";

type AnimationType = "text" | "word" | "character" | "line";
type AnimationVariant =
  | "fadeIn"
  | "blurIn"
  | "slideUp"
  | "slideDown";

interface TextAnimateProps {
  /**
   * The text content to animate
   */
  children: string;
  /**
   * The class name to be applied to the component
   */
  className?: string;
  /**
   * The delay before the animation starts
   */
  delay?: number;
  /**
   * The duration of the animation
   */
  duration?: number;
  /**
   * The element type to render
   */
  as?: ElementType;
  /**
   * How to split the text (text, word, character, line)
   */
  by?: AnimationType;
  /**
   * Whether to start animation when component enters viewport
   */
  startOnView?: boolean;
  /**
   * Whether to animate only once
   */
  once?: boolean;
  /**
   * The animation preset to use
   */
  animation?: AnimationVariant;
}

const defaultAnimationVariants = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
      },
    },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  },
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  },
};

const TextAnimateBase = ({
  children,
  delay = 0,
  duration = 0.3,
  className,
  as: Component = "p",
  startOnView = true,
  once = true,
  by = "word",
  animation = "fadeIn",
}: TextAnimateProps) => {
  // Use a safer approach for motion components
  let MotionComponent = motion.div;
  if (Component === "p") MotionComponent = motion.p;
  else if (Component === "h1") MotionComponent = motion.h1;
  else if (Component === "h2") MotionComponent = motion.h2;
  else if (Component === "h3") MotionComponent = motion.h3;
  else if (Component === "h4") MotionComponent = motion.h4;
  else if (Component === "h5") MotionComponent = motion.h5;
  else if (Component === "h6") MotionComponent = motion.h6;
  else if (Component === "span") MotionComponent = motion.span;

  let segments: string[] = [];
  switch (by) {
    case "word":
      segments = children.split(/(\s+)/);
      break;
    case "character":
      segments = children.split("");
      break;
    case "line":
      segments = children.split("\n");
      break;
    case "text":
    default:
      segments = [children];
      break;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: duration / segments.length,
      },
    },
  };

  const itemVariant = defaultAnimationVariants[animation];

  return (
    <AnimatePresence mode="wait">
      <MotionComponent
        variants={containerVariants}
        initial="hidden"
        whileInView={startOnView ? "show" : undefined}
        animate={startOnView ? undefined : "show"}
        className={cn("whitespace-pre-wrap", className)}
        viewport={{ once }}
      >
        {segments.map((segment, i) => (
          <motion.span
            key={`${by}-${segment}-${i}`}
            variants={itemVariant}
            className={cn(
              by === "line" ? "block" : "inline-block whitespace-pre",
            )}
          >
            {segment}
          </motion.span>
        ))}
      </MotionComponent>
    </AnimatePresence>
  );
};

// Export the memoized version
export const TextAnimate = memo(TextAnimateBase);
