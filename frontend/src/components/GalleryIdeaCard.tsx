// components/GalleryIdeaCard.tsx

import React from "react";
import { XCircle, Eye, Star } from "lucide-react";
import Cookies from "js-cookie";

interface GalleryIdeaCardProps {
    idea: {
        title: string;
        subject: string;
        description: string[];
        budget: string | null;
        time: string;
        superidea?: boolean;
    };
    onDelete?: () => void;
    onToggle?: () => void;
    onOpen?: () => void; // placeholder – obecnie nie implementujemy logiki
}

export default function GalleryIdeaCard({ idea, onDelete, onToggle, onOpen }: GalleryIdeaCardProps) {
    // Funkcja usuwająca
    const handleDelete = () => {
        const data = localStorage.getItem("savedIdeas");
        if (data) {
            try {
                const ideas = JSON.parse(data);
                const updated = ideas.filter((i: any) => i.title !== idea.title);
                localStorage.setItem("savedIdeas", JSON.stringify(updated));
                Cookies.set("savedIdeas", JSON.stringify(updated), { expires: 7, path: "/" });
                window.dispatchEvent(new Event("storage"));
                onDelete && onDelete();
            } catch (e) {
                console.error("Error deleting idea:", e);
            }
        }
    };

    // Funkcja toggle – zmienia wartość superidea dla tego pomysłu
    const handleToggle = () => {
        const data = localStorage.getItem("savedIdeas");
        if (data) {
            try {
                const ideas = JSON.parse(data);
                const updated = ideas.map((i: any) => {
                    if (i.title === idea.title) {
                        return { ...i, superidea: !i.superidea };
                    }
                    return i;
                });
                localStorage.setItem("savedIdeas", JSON.stringify(updated));
                Cookies.set("savedIdeas", JSON.stringify(updated), { expires: 7, path: "/" });
                window.dispatchEvent(new Event("storage"));
                onToggle && onToggle();
            } catch (e) {
                console.error("Error toggling idea:", e);
            }
        }
    };

    // Placeholder dla przycisku otwierania szczegółowego widoku
    const handleOpen = () => {
        onOpen && onOpen();
    };

    return (
        <div
            className="relative rounded-3xl bg-gray-200 overflow-hidden shadow-2xl p-4 select-none"
            style={{ minHeight: "24rem" }}
        >
            {/* Gwiazdka (super idea) wyświetlana w prawym górnym rogu – wypełniona */}
            {idea.superidea && (
                <div className="absolute top-5 right-5 -translate-x-1 translate-y-1">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                </div>
            )}

            {/* Biały obszar wewnątrz o stałej wysokości 24rem */}
            <div className="bg-white rounded-3xl shadow-lg p-6 text-black h-[24rem] flex flex-col">
                <div>
                    <h2 className="text-2xl font-bold mb-2">{idea.title}</h2>
                    <p className="text-sm text-gray-600 mb-2">{idea.subject}</p>
                </div>
                <div className="border-t border-gray-300 mt-2 pt-2 overflow-y-auto flex-grow">
                    {idea.description?.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {idea.description.map((desc, index) => (
                                <li key={index}>{desc}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No description provided.</p>
                    )}
                </div>
                {/* Tabela Budget/Time w obrębie białego obszaru */}
                <div className="mt-4">
                    <div className="grid grid-cols-2 text-sm font-semibold text-gray-700">
                        <div className="text-center">Budget:</div>
                        <div className="text-center">Time:</div>
                    </div>
                    <div className="grid grid-cols-2 text-sm text-gray-700">
                        <div className="text-center">{idea.budget ?? "None"}</div>
                        <div className="text-center">{idea.time}</div>
                    </div>
                </div>
            </div>

            {/* Sekcja przycisków – umieszczona poniżej białego obszaru */}
            <div className="mt-6 flex justify-around">
                <button
                    onClick={handleToggle}
                    className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full px-4 py-2 text-sm"
                >
                    <Star className={`w-5 h-5 ${idea.superidea ? "text-green-500" : "text-yellow-500"}`} />
                </button>
                <button
                    onClick={handleOpen}
                    className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full px-4 py-2 text-sm"
                >
                    <Eye className="w-5 h-5 text-blue-500" />
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full px-4 py-2 text-sm"
                >
                    <XCircle className="w-5 h-5 text-red-500" />
                </button>
            </div>
        </div>
    );
}
