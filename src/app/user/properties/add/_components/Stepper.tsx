import React from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  items: { label: string }[];
  activeItem: number;
  setActiveItem: (index: number) => void;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ items, activeItem, setActiveItem, className }) => {
  return (
    <div className={cn("flex items-center justify-between text-secondary p-3 rounded-md", className)}>
      {items.map((item, index) => {
        const isActive = activeItem === index;
        const isCompleted = index < activeItem; // steps before current
        const stepNumber = index + 1;

        return (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center flex-1 mt-4",
              isCompleted && "cursor-pointer hover:scale-105"
            )}
            onClick={() => {
              if (isCompleted) setActiveItem(index); // Only allow going back
            }}
          >
            {/* Step Circle */}
            <span
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-colors duration-300 text-white",
                isActive
                  ? "bg-secondary"
                  : isCompleted
                  ? "bg-secondary"
                  : "bg-primary"
              )}
            >
              {isCompleted ? "✓" : stepNumber}
            </span>
            {/* Label */}
            <p
              className={cn(
                "text-xs transition-colors duration-300",
                isActive
                  ? "font-semibold text-secondary"
                  : isCompleted
                  ? "font-medium text-green-600"
                  : "font-normal text-gray-500"
              )}
            >
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
