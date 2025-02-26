"use client";

import { useMotionValue, useTransform, animate, PanInfo, motion } from "framer-motion";
import Card from "@/components/ui/card";
import {
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
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
  onSwipe?: (direction: "accept" | "reject" | "super") => void;
  overlayResult?: "accept" | "reject" | "super" | null;
  placeholder?: boolean;
}

export default function IdeaCard({
                                   idea,
                                   onSwipe,
                                   overlayResult = null,
                                   placeholder = false,
                                 }: IdeaCardProps) {
  const swipe = onSwipe || (() => {});
  const isMobile = useIsMobile();
  const containerClasses = "w-[600px] h-[700px]";
  const cardHeight = "h-[600px]";
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const overlayColor = useTransform(
      x,
      [-200, 0, 200],
      ["rgba(255,0,0,0.5)", "rgba(0,0,0,0)", "rgba(0,255,0,0.5)"]
  );

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      animate(x, 100, { type: "spring", stiffness: 300, damping: 30 }).then(() => {
        swipe("accept");
        animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
      });
    } else if (info.offset.x < -100) {
      animate(x, -100, { type: "spring", stiffness: 300, damping: 30 }).then(() => {
        swipe("reject");
        animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
      });
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  const handleAccept = () => {
    animate(x, 100, { type: "spring", stiffness: 300, damping: 30 }).then(() => {
      swipe("accept");
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    });
  };

  const handleReject = () => {
    animate(x, -100, { type: "spring", stiffness: 300, damping: 30 }).then(() => {
      swipe("reject");
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    });
  };

  const handleSuperIdea = () => {
    swipe("super");
  };

  const renderOverlayResult = () => {
    if (!overlayResult) return null;
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {overlayResult === "accept" ? (
              <div className="rounded-full p-4 bg-green-500 bg-opacity-70">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
          ) : overlayResult === "reject" ? (
              <div className="rounded-full p-4 bg-red-500 bg-opacity-70">
                <XCircle className="w-16 h-16 text-white" />
              </div>
          ) : overlayResult === "super" ? (
              <div className="rounded-full p-4 bg-yellow-500 bg-opacity-70">
                <Star className="w-16 h-16 text-white" />
              </div>
          ) : null}
        </motion.div>
    );
  };

  if (placeholder) {
    return (
        <div className={`relative rounded-3xl bg-gray-200 overflow-hidden ${containerClasses} mx-auto p-4 shadow-2xl select-none`}>
          <div className="pb-2">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative ${cardHeight} cursor-grab active:cursor-grabbing`}
            >
              <Card className="w-full h-full relative overflow-hidden bg-white shadow-2xl rounded-3xl p-6">
                <div className="flex flex-col h-full items-center justify-center select-none">
                  <p className="font-bold text-gray-700 text-2xl">Out of Ideas.</p>
                  <p className="font-bold text-gray-700 text-2xl">Maybe generate one? 💡</p>
                </div>
              </Card>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 h-20">
            <button
                onClick={handleReject}
                className="flex items-center justify-center w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-full"
            >
              <XCircle className="w-8 h-8 text-red-500" />
            </button>
            <button
                onClick={handleSuperIdea}
                className="flex items-center justify-center w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-full"
            >
              <Star className="w-8 h-8 text-yellow-500" />
            </button>
            <button
                onClick={handleAccept}
                className="flex items-center justify-center w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-full"
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
            </button>
          </div>
          {renderOverlayResult()}
        </div>
    );
  }

  return (
      <div className={`relative rounded-3xl bg-gray-200 overflow-hidden ${containerClasses} mx-auto p-4 shadow-2xl`}>
        <div className="pb-2">
          <motion.div
              style={{ x, rotate }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className={`relative ${cardHeight} cursor-grab active:cursor-grabbing`}
          >
            <Card className="w-full h-full relative overflow-hidden bg-white shadow-2xl rounded-3xl p-0">
              <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundColor: overlayColor }}
              />
              <div className="relative flex flex-col h-full px-12 py-4">
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-1">
                    <h2
                        className="font-bold text-gray-900"
                        style={{ fontSize: isMobile ? "calc(1.8rem + 1vw)" : "2rem" }}
                    >
                      {idea?.title}
                    </h2>
                    <p
                        className="text-gray-600 pt-4"
                        style={{ fontSize: isMobile ? "calc(0.6rem + 1vw)" : "0.8rem" }}
                    >
                      {idea?.subject}
                    </p>
                  </div>
                  <div className="space-y-2 mt-2">
                    <h3 className="text-xl font-semibold text-gray-700">Description:</h3>
                    <div className="max-h-48 overflow-y-auto">
                      <ul className="list-disc list-inside space-y-1 text-base text-gray-600">
                        {idea?.description?.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-300 mt-1 pt-3">
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
            </Card>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 h-20">
          <button
              onClick={handleReject}
              className="flex items-center justify-center w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-full"
          >
            <XCircle className="w-8 h-8 text-red-500" />
          </button>
          <button
              onClick={handleSuperIdea}
              className="flex items-center justify-center w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-full"
          >
            <Star className="w-8 h-8 text-yellow-500" />
          </button>
          <button
              onClick={handleAccept}
              className="flex items-center justify-center w-12 h-12 bg-gray-300 hover:bg-gray-400 rounded-full"
          >
            <CheckCircle className="w-8 h-8 text-green-500" />
          </button>
        </div>
        {renderOverlayResult()}
      </div>
  );
}
