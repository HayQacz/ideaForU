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
    onOpen?: () => void;
    onUpdateSavedIdeas?: (updated: any[]) => void;
}

export default function GalleryIdeaCard({
                                            idea,
                                            onDelete,
                                            onToggle,
                                            onOpen,
                                            onUpdateSavedIdeas,
                                        }: GalleryIdeaCardProps) {
    const handleDelete = () => {
        const data = localStorage.getItem("savedIdeas");
        if (data) {
            try {
                const ideas = JSON.parse(data);
                const updated = ideas.filter((i: any) => i.title !== idea.title);
                localStorage.setItem("savedIdeas", JSON.stringify(updated));
                Cookies.set("savedIdeas", JSON.stringify(updated), { expires: 7, path: "/" });
                onUpdateSavedIdeas && onUpdateSavedIdeas(updated);
                onDelete && onDelete();
            } catch (e) {
                console.error("Error deleting idea:", e);
            }
        }
    };

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
                onUpdateSavedIdeas && onUpdateSavedIdeas(updated);
                onToggle && onToggle();
            } catch (e) {
                console.error("Error toggling idea:", e);
            }
        }
    };

    const handleOpen = () => {
        onOpen && onOpen();
    };

    return (
        <div className="relative rounded-3xl bg-gray-200 overflow-hidden shadow-2xl p-4 select-none" style={{ minHeight: "24rem" }}>
            {idea.superidea && (
                <div className="absolute top-5 right-5 -translate-x-1 translate-y-1">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                </div>
            )}
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
        </div>
    );
}
