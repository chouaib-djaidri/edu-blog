"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const horizontalVariants = {
  enter: {
    scale: 0.5,
    opacity: 0,
  },
  center: {
    scale: 1,
    opacity: 1,
  },
  exit: {
    scale: 0.5,
    opacity: 0,
  },
};

const FadedAnimation = ({
  children,
  k,
  className,
}: {
  children: React.ReactNode;
  k: number | string;
  className?: string;
}) => {
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        className={cn(
          "w-full h-full absolute flex items-center justify-center flex-row",
          className
        )}
        key={k}
        variants={horizontalVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: 0.2,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default FadedAnimation;
