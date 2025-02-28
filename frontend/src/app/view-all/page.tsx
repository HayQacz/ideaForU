"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import GalleryIdeaCard from "@/components/GalleryIdeaCard";

interface Idea {
    title: string;
    subject: string;
    description: string[];
    budget: string | null;
    time: string;
    superidea?: boolean;
}

export default function ViewAllIdeas() {
    const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);

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

    useEffect(() => {
        loadSavedIdeas();
        window.addEventListener("storage", loadSavedIdeas);
        window.addEventListener("focus", loadSavedIdeas);
        return () => {
            window.removeEventListener("storage", loadSavedIdeas);
            window.removeEventListener("focus", loadSavedIdeas);
        };
    }, []);

    const superIdeas = savedIdeas.filter((idea) => idea.superidea);
    const normalIdeas = savedIdeas.filter((idea) => !idea.superidea);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-600 to-indigo-900 p-8 text-white">
            <div className="w-full max-w-6xl flex items-center mb-8">
                <Link href="/" className="text-white text-lg font-bold mr-4">
                    ← Back
                </Link>
                <h1 className="flex-1 text-5xl font-extrabold tracking-tight text-center">
                    ideaForU - View All Ideas
                </h1>
            </div>

            <div className="w-full max-w-6xl">
                {superIdeas.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
                            ⭐ Saved Super Ideas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {superIdeas.map((idea, index) => (
                                <GalleryIdeaCard
                                    key={index}
                                    idea={idea}
                                    onUpdateSavedIdeas={(updated) => setSavedIdeas(updated)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {normalIdeas.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-green-600">
                            💚 Saved Ideas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {normalIdeas.map((idea, index) => (
                                <GalleryIdeaCard
                                    key={index}
                                    idea={idea}
                                    onUpdateSavedIdeas={(updated) => setSavedIdeas(updated)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {savedIdeas.length === 0 && (
                    <p className="text-center text-xl mt-12">
                        No ideas found. Try adding some first!
                    </p>
                )}
            </div>
        </div>
    );
}
