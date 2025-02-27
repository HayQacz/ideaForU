"use client";

import { useState, useEffect, useRef } from "react";
import Card from "../components/ui/card";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import IdeaCard from "../components/idea-card";
import { AnimatePresence, motion } from "framer-motion";
import SavedIdeasSidebar from "../components/SavedIdeasSidebar";

export default function IdeasForU() {
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [lastSwipeResult, setLastSwipeResult] = useState<"accept" | "reject" | "super" | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [cardFixedHeight, setCardFixedHeight] = useState<number | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [showSavedMenu, setShowSavedMenu] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Ustawienie responsywności (mobile/desktop)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Ustawienie stałej wysokości kontenera na mobile
  useEffect(() => {
    if (isMobile && panelOpen && cardContainerRef.current) {
      setCardFixedHeight(cardContainerRef.current.offsetHeight);
    }
  }, [isMobile, panelOpen, ideas, currentIdeaIndex]);

  // Funkcja do odczytu zapisanych pomysłów z localStorage (używamy localStorage dla mobilnych widoków)
  const loadSavedIdeas = () => {
    const data = localStorage.getItem("savedIdeas");
    if (data) {
      try {
        setSavedIdeas(JSON.parse(data));
      } catch (e) {
        console.error("Error parsing savedIdeas from localStorage", e);
        setSavedIdeas([]);
      }
    } else {
      setSavedIdeas([]);
    }
  };

  // Inicjujemy stan zapisanych pomysłów przy montowaniu
  useEffect(() => {
    loadSavedIdeas();
  }, []);

  // Nasłuchujemy zdarzeń focus oraz storage, aby odświeżać stan (dotyczy obu wersji, ale mobilna korzysta z localStorage)
  useEffect(() => {
    const handleUpdate = () => {
      loadSavedIdeas();
    };
    window.addEventListener("focus", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Dla wersji mobilnej – dodatkowo odświeżamy stan co 2 sekundy
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        loadSavedIdeas();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  const generateIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/generate-ideas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: subject, keywords: keywords }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate ideas");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setIdeas((prev) => [...prev, ...data]);
        if (isMobile) {
          setPanelOpen(false);
        }
      } else {
        throw new Error("No ideas received from the backend");
      }
    } catch (error: unknown) {
      console.error("Error fetching ideas:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: "accept" | "reject" | "super") => {
    setLastSwipeResult(direction);
    if (direction === "accept" || direction === "super") {
      const ideaToSave = { ...ideas[currentIdeaIndex], superidea: direction === "super" };
      // Aktualizujemy stan zapisanych pomysłów przy użyciu updatera
      setSavedIdeas((prev) => {
        const updated = [...prev, ideaToSave];
        // Zapisujemy do ciasteczka oraz do localStorage – dla spójności
        Cookies.set("savedIdeas", JSON.stringify(updated), { expires: 7, path: "/" });
        localStorage.setItem("savedIdeas", JSON.stringify(updated));
        return updated;
      });
    }
    setCurrentIdeaIndex((prev) => prev + 1);
    setTimeout(() => setLastSwipeResult(null), 1000);
  };

  // Obliczenia do mobilnego menu
  const totalCount = savedIdeas.length;
  const superCount = savedIdeas.filter((idea: any) => idea.superidea).length;
  const normalCount = savedIdeas.filter((idea: any) => !idea.superidea).length;

  return (
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-600 to-indigo-900 p-8 text-white relative">
        <div className="w-full max-w-xl select-none">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-center select-none">ideaForU</h1>
          <p className="text-lg text-gray-300 mb-8 text-center select-none">
            Generate creative ideas based on your interests✨
          </p>
          {isMobile && (
              <div className="flex justify-center mb-4">
                <button onClick={() => setPanelOpen(!panelOpen)} className="focus:outline-none">
                  {panelOpen ? (
                      <ChevronUp className="w-6 h-6 text-white" />
                  ) : (
                      <ChevronDown className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
          )}
          <AnimatePresence>
            {(!isMobile || panelOpen) && (
                <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                  <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await generateIdeas();
                      }}
                  >
                    <Card className="p-8 space-y-6 bg-white text-black rounded-2xl shadow-2xl">
                      <Input
                          placeholder="Enter subject..."
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="text-lg border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full"
                      />
                      <Input
                          placeholder="Enter keywords..."
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          className="text-lg border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full"
                      />
                      <Button
                          type="submit"
                          disabled={loading || !subject || !keywords}
                          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-all"
                      >
                        {loading ? (
                            <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating ideas...
                      </span>
                        ) : (
                            "Generate Ideas💡"
                        )}
                      </Button>
                    </Card>
                  </form>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Mobilne menu zapisanych pomysłów */}
          {isMobile && (
              <div className="mt-4">
                <button onClick={() => setShowSavedMenu(!showSavedMenu)} className="w-full text-left font-bold">
                  Saved Ideas ({totalCount})
                </button>
                {showSavedMenu && (
                    <div className="mt-2">
                      <div className="text-yellow-600 font-semibold">
                        Saved Super Ideas ({superCount})
                      </div>
                      <div className="text-green-600 font-semibold">
                        Saved Ideas ({normalCount})
                      </div>
                    </div>
                )}
              </div>
          )}
        </div>

        <div
            ref={cardContainerRef}
            className={
              isMobile
                  ? `flex-1 flex w-full min-h-0 ${panelOpen ? "mt-12" : "items-start"}`
                  : "flex-grow flex items-center justify-center w-full mt-12"
            }
            style={isMobile && !panelOpen && cardFixedHeight ? { height: cardFixedHeight } : {}}
        >
          <AnimatePresence mode="wait">
            {currentIdeaIndex < ideas.length ? (
                <IdeaCard
                    idea={ideas[currentIdeaIndex]}
                    onSwipe={handleSwipe}
                    overlayResult={lastSwipeResult}
                    key={currentIdeaIndex}
                />
            ) : (
                <IdeaCard placeholder overlayResult={lastSwipeResult} key="placeholder" />
            )}
          </AnimatePresence>
        </div>

        {/* Pasek boczny widoczny tylko na desktop */}
        {!isMobile && <SavedIdeasSidebar />}
      </div>
  );
}
