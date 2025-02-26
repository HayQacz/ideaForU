"use client";

import { useMotionValue, useTransform, PanInfo, motion } from "framer-motion";
import Card from "@/components/ui/card";
import { ArrowLeftCircle, ArrowRightCircle, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

interface IdeaCardProps {
  idea?: {
    title: string;
    subject: string;
    description: string[];
    budget: string | null;
    time: string;
  };
  onSwipe?: (direction: "left" | "right") => void;
  overlayResult?: "accept" | "reject" | null;
  placeholder?: boolean;
}

export default function IdeaCard({
  idea,
  onSwipe = () => {},
  overlayResult = null,
  placeholder = false,
}: IdeaCardProps) {
  const isMobile = useIsMobile();
  const cardHeightClass = isMobile ? "h-full" : "h-[600px]";
  const containerClasses = isMobile ? "w-full px-2" : "w-[600px] mx-auto";

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const overlayColor = useTransform(
    x,
    [-200, 0, 200],
    ["rgba(255,0,0,0.5)", "rgba(0,0,0,0)", "rgba(0,255,0,0.5)"]
  );

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      x.set(100);
      onSwipe("right");
      setTimeout(() => x.set(0), 300);
    } else if (info.offset.x < -100) {
      x.set(-100);
      onSwipe("left");
      setTimeout(() => x.set(0), 300);
    } else {
      x.set(0);
    }
  };

  const handleAccept = () => {
    x.set(100);
    onSwipe("right");
    setTimeout(() => x.set(0), 300);
  };

  const handleReject = () => {
    x.set(-100);
    onSwipe("left");
    setTimeout(() => x.set(0), 300);
  };

  if (placeholder) {
    return (
      <div className={`relative ${containerClasses}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative ${cardHeightClass}`}
        >
          <Card className="w-full h-full relative overflow-hidden bg-white shadow-lg rounded-lg p-6">
            <div className="relative flex flex-col h-full px-12 py-4">
              {/* Overlay dynamiczny – top/bottom: -2rem, left/right: 1.5rem */}
              <motion.div
                className="absolute top-[-2rem] bottom-[-2rem] left-[1.5rem] right-[1.5rem] pointer-events-none z-10 rounded-lg"
                style={{ backgroundColor: overlayColor }}
              />
              <div className="relative z-20 flex flex-col items-center justify-center">
                <p
                  className="font-bold text-gray-700"
                  style={{ fontSize: isMobile ? "calc(1.8rem + 1vw)" : "2rem" }}
                >
                  Out of Ideas.
                </p>
                <p
                  className="font-bold text-gray-700"
                  style={{ fontSize: isMobile ? "calc(1.8rem + 1vw)" : "2rem" }}
                >
                  Maybe generate one? 💡
                </p>
              </div>
            </div>
            {overlayResult && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 rounded-lg"
              >
                {overlayResult === "accept" ? (
                  <div className="rounded-full p-4 bg-green-500 bg-opacity-70">
                    <CheckCircle className="w-16 h-16 text-white" />
                  </div>
                ) : (
                  <div className="rounded-full p-4 bg-red-500 bg-opacity-70">
                    <XCircle className="w-16 h-16 text-white" />
                  </div>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`relative ${containerClasses}`}>
      <motion.div
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`relative ${cardHeightClass} cursor-grab active:cursor-grabbing`}
      >
        <Card className="w-full h-full relative overflow-hidden transition-transform duration-300 hover:scale-[1.01] bg-white shadow-lg rounded-lg p-0">
          <div className="relative flex flex-col h-full px-12 py-4">
            {/* Overlay dynamiczny – top/bottom: -2rem, left/right: 1.5rem */}
            <motion.div
              className="absolute top-[-2rem] bottom-[-2rem] left-[1.5rem] right-[1.5rem] pointer-events-none z-10 rounded-lg"
              style={{ backgroundColor: overlayColor }}
            />
            <div className="relative z-20">
              <div className="space-y-1">
                <h2
                  className="font-bold text-gray-900"
                  style={{ fontSize: isMobile ? "calc(1.8rem + 1vw)" : "2rem" }}
                >
                  {idea?.title}
                </h2>
                <p
                  className="text-gray-600"
                  style={{ fontSize: isMobile ? "calc(1.2rem + 1vw)" : "1.2rem" }}
                >
                  {idea?.subject}
                </p>
              </div>
              <div className="space-y-2 mt-4">
                <h3 className="text-xl font-semibold text-gray-700">Description:</h3>
                <ul className="list-disc list-inside space-y-1 text-base text-gray-600">
                  {idea?.description.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium text-gray-700">Budget:</span>
                  <span className="text-lg text-gray-600">{idea?.budget || "None"}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium text-gray-700">Time:</span>
                  <span className="text-lg text-gray-600">{idea?.time}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleReject}
            className="absolute left-0 top-0 h-full w-12 flex items-center justify-center bg-red-500 bg-opacity-70 transition-all duration-200 hover:scale-110 hover:bg-opacity-60 z-30"
          >
            <ArrowLeftCircle className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={handleAccept}
            className="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-green-500 bg-opacity-70 transition-all duration-200 hover:scale-110 hover:bg-opacity-60 z-30"
          >
            <ArrowRightCircle className="w-8 h-8 text-white" />
          </button>
          {overlayResult && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 rounded-lg"
            >
              {overlayResult === "accept" ? (
                <div className="rounded-full p-4 bg-green-500 bg-opacity-70">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
              ) : (
                <div className="rounded-full p-4 bg-red-500 bg-opacity-70">
                  <XCircle className="w-16 h-16 text-white" />
                </div>
              )}
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
