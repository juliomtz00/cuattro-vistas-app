"use client";

import { Card, cn, Image } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const fallbackImage = "https://via.placeholder.com/800x600?text=Sin+imagen";

export const ImageSlider = ({
  images,
  autoplay = true,
  direction = "up",
  className,
}: {
  images: string[];
  autoplay?: boolean;
  direction?: "up" | "down";
  className?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const allImages = images.length > 0 ? images : [fallbackImage];

  const next = () =>
    setCurrentIndex((prev) => (prev + 1 === allImages.length ? 0 : prev + 1));
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 < 0 ? allImages.length - 1 : prev - 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => next(), 5000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const slideVariants = {
    initial: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      y: direction === "up" ? "-100%" : "100%",
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <Card
        className={cn(
          "relative overflow-hidden w-full h-96 flex items-center justify-center bg-black",
          className
        )}
        style={{ perspective: "1000px" }}
        onClick={() => setIsFullscreen(true)}
      >
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={allImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="absolute w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={cn(
                "w-3 h-3 rounded-full border",
                index === currentIndex
                  ? "bg-white border-white"
                  : "bg-transparent border-white/50"
              )}
            />
          ))}
        </div>
      </Card>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <Image
            src={allImages[currentIndex]}
            alt="Fullscreen"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </>
  );
};
