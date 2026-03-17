"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";
import { parseClinicalMedia } from "@/lib/utils-data";
import { Button } from "@/components/ui/button";

interface MediaGalleryProps {
    urls: string[];
}

export function ClinicalMediaGallery({ urls }: MediaGalleryProps) {
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

    if (urls.length === 0) {
        return (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <p className="text-slate-400 font-medium">No clinical evidence found for this session.</p>
            </div>
        );
    }

    const handleMediaClick = (url: string) => {
        setSelectedMedia(url);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {urls.map((url, i) => {
                    const info = parseClinicalMedia(url);
                    if (!info) return null;

                    return (
                        <div 
                            key={i} 
                            onClick={() => handleMediaClick(url)}
                            className="group relative aspect-square bg-slate-100 rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all border border-slate-200 shadow-sm"
                        >
                            <img src={info.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                            
                            {/* Type Labels for Absolute Clarity */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                <div className={`w-1.5 h-1.5 rounded-full ${info.isVideo ? 'bg-blue-400 animate-pulse' : 'bg-emerald-400'}`} />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">
                                    {info.isVideo ? 'Motion' : 'Photo'}
                                </span>
                            </div>

                            {info.isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                                        <Play className="h-8 w-8 text-white fill-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedMedia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-300">
                    <button 
                        onClick={() => setSelectedMedia(null)}
                        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-2xl border border-white/5">
                        {(() => {
                            const info = parseClinicalMedia(selectedMedia);
                            if (!info) return null;

                            return info.isVideo ? (
                                <div className="w-full h-full relative group">
                                    <iframe 
                                        src={info.previewUrl} 
                                        className="w-full h-full border-none"
                                        allow="autoplay"
                                        title="Clinical Motion Review"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <p className="text-white text-xs font-bold uppercase tracking-widest px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-md rounded-lg">
                                            Motion Observation Mode
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <img src={info.downloadUrl} alt="" className="max-w-full max-h-full object-contain" />
                            );
                        })()}
                        
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white/40 text-[10px] uppercase font-bold tracking-widest pointer-events-none">
                            <p>Diagnostic Clinical Evidence</p>
                            <a 
                                href={parseClinicalMedia(selectedMedia)?.downloadUrl} 
                                download 
                                className="pointer-events-auto text-primary hover:text-primary/80 underline decoration-primary/40 underline-offset-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Force Raw Access
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
