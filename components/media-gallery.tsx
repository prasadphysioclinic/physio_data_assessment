"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";
import { convertDriveUrl, isVideoUrl } from "@/lib/utils-data";
import { Button } from "@/components/ui/button";

interface MediaGalleryProps {
    urls: string[];
}

export function ClinicalMediaGallery({ urls }: MediaGalleryProps) {
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);

    if (urls.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[11px] font-black uppercase tracking-widest bg-slate-50/50">
                No Clinical Evidence Recorded
            </div>
        );
    }

    const handleMediaClick = (url: string) => {
        setVideoError(null);
        setSelectedMedia(url);
    };

    const closeModal = () => {
        setSelectedMedia(null);
        setVideoError(null);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {urls.map((url, i) => {
                    const isVideo = isVideoUrl(url);
                    const thumbnailUrl = convertDriveUrl(url, 'thumbnail');

                    return (
                        <div 
                            key={i} 
                            onClick={() => handleMediaClick(url)}
                            className="group relative aspect-square bg-slate-100 rounded-3xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
                        >
                            <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Play className="h-10 w-10 text-white fill-white" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedMedia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
                    <button onClick={closeModal} className="absolute top-10 right-10 z-50 p-3 bg-white/10 rounded-full text-white">
                        <X className="h-8 w-8" />
                    </button>

                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center">
                        {isVideoUrl(selectedMedia) ? (
                            <div className="w-full h-full relative group">
                                <video 
                                    src={convertDriveUrl(selectedMedia, 'download')} 
                                    className="w-full h-full"
                                    poster={convertDriveUrl(selectedMedia, 'thumbnail')}
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 pointer-events-none">
                                    <p className="text-white text-xs font-bold uppercase tracking-widest">Clinical Observation Mode</p>
                                </div>
                            </div>
                        ) : (
                            <img src={convertDriveUrl(selectedMedia, 'download')} alt="" className="max-w-full max-h-full object-contain" />
                        )}
                        
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white/40 text-[10px] uppercase font-bold tracking-widest pointer-events-none">
                            <p>Direct Clinical Stream</p>
                            {isVideoUrl(selectedMedia) && (
                                <a 
                                    href={convertDriveUrl(selectedMedia, 'download')} 
                                    download 
                                    className="pointer-events-auto text-primary hover:text-primary/80 underline decoration-primary/40 underline-offset-4"
                                >
                                    Force Download
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
