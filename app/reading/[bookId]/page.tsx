"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";

type ModuleInfo = {
    id: string;
    title: string;
    icon: string;
    active?: boolean;
};

type BookMeta = {
    id: string;
    title: string;
    author: string;
    description: string;
};

export default function BookDetailPage() {
    const params = useParams();
    const bookId = params.bookId as string;

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [bookMeta, setBookMeta] = useState<BookMeta | null>(null);
    const [modules, setModules] = useState<ModuleInfo[]>([]);
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load book metadata from books.json
    useEffect(() => {
        fetch("/reading-legacy/data/books.json")
            .then((r) => r.json())
            .then((data) => {
                const book = data.books?.find(
                    (b: { id: string }) => b.id === bookId
                );
                if (book) setBookMeta(book);
            })
            .catch(console.error);
    }, [bookId]);

    // Load registry to get module list
    useEffect(() => {
        fetch(`/reading-legacy/data/${bookId}/registry.json`)
            .then((r) => r.json())
            .then((reg) => {
                const mods: ModuleInfo[] = (reg.modules || []).map(
                    (m: ModuleInfo) => ({
                        id: m.id,
                        title: m.title,
                        icon: m.icon,
                        active: !!m.active,
                    })
                );
                setModules(mods);
                const defaultMod = mods.find((m) => m.active) || mods[0];
                if (defaultMod) setActiveModule(defaultMod.id);
            })
            .catch(console.error);
    }, [bookId]);

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === "book-embed-ready") {
                setLoading(false);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    // When user clicks a tab, send message to iframe
    const switchModule = (moduleId: string) => {
        setActiveModule(moduleId);
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                { type: "activateModule", id: moduleId },
                "*"
            );
        }
    };

    const registryParam = `../data/${bookId}/registry.json`;
    const iframeSrc = `/reading-legacy/books/book-embed.html?registry=${encodeURIComponent(registryParam)}`;

    return (
        <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
            {/* ===== Top Bar ===== */}
            <div className="shrink-0 border-b border-gray-100 bg-white/90 backdrop-blur-lg">
                <div className="container max-w-7xl flex items-center gap-4 h-14">
                    {/* Back */}
                    <Link
                        href="/reading"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors shrink-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">书架</span>
                    </Link>

                    {/* Divider */}
                    <div className="h-5 w-px bg-gray-200 shrink-0" />

                    {/* Book Title */}
                    <h1 className="text-sm font-bold text-gray-900 truncate">
                        {bookMeta?.title || bookId}
                    </h1>

                    {/* Module Tabs — scrollable */}
                    <div className="flex-1 overflow-x-auto ml-3">
                        <div className="flex gap-1 min-w-max">
                            {modules.map((mod) => (
                                <button
                                    key={mod.id}
                                    onClick={() => switchModule(mod.id)}
                                    className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${activeModule === mod.id
                                            ? "bg-blue-50 text-blue-700 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                        }
                  `}
                                >
                                    <span>{mod.icon}</span>
                                    <span>{mod.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Content Area ===== */}
            <div className="flex-1 relative bg-gray-50">
                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 animate-pulse">
                            <BookOpen className="h-7 w-7 text-blue-600" />
                        </div>
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500 mb-2" />
                        <p className="text-sm text-gray-400">
                            正在加载《{bookMeta?.title || "..."}》
                        </p>
                    </div>
                )}

                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    title={bookMeta?.title || "Book Reader"}
                    className="w-full h-full border-0"
                    onLoad={() => {
                        // Fallback: if postMessage doesn't fire within 3s, hide loading anyway
                        setTimeout(() => setLoading(false), 3000);
                    }}
                />
            </div>
        </div>
    );
}
