// components/SavedIdeasSidebar.tsx
import React, { useState, useEffect } from "react";

interface Idea {
    title: string;
    superidea?: boolean;
}

const SavedIdeasSidebar: React.FC = () => {
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
    const totalCount = savedIdeas.length;

    return (
        <div className="hidden md:block fixed right-4 top-20 w-72 bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-4 border border-gray-200">
            <div className="mb-4">
                <button className="w-full text-left font-bold text-gray-800">
                    Saved Ideas ({totalCount})
                </button>
            </div>
            <div>
                <div className="mb-4">
                    <button className="w-full text-left font-semibold text-yellow-600">
                        ⭐ Saved Super Ideas ({superIdeas.length})
                    </button>
                    <ul className="mt-2 space-y-1">
                        {superIdeas.map((idea, index) => (
                            <li key={index} className="text-sm text-gray-700">
                                {idea.title}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mb-4">
                    <button className="w-full text-left font-semibold text-green-600">
                        💚 Saved Ideas ({normalIdeas.length})
                    </button>
                    <ul className="mt-2 space-y-1">
                        {normalIdeas.map((idea, index) => (
                            <li key={index} className="text-sm text-gray-700">
                                {idea.title}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <button
                        onClick={() => (window.location.href = "/view-all")}
                        className="w-full text-left font-semibold underline text-blue-600 hover:text-blue-800"
                    >
                        View All Ideas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SavedIdeasSidebar;
