"use client";

import { useState } from "react";
import { X, Play, Maximize2, FileVideo, FileImage } from "lucide-react";
import { convertDriveUrl, isVideoUrl } from "@/lib/utils-data";
import { Button } from "@/components/ui/button";

interface MediaGalleryProps {
    urls: string[];
}

export function ClinicalMediaGallery({ urls }: MediaGalleryProps) {
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

    if (urls.length === 0) {
        return (
            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[11px] font-black uppercase tracking-widest bg-slate-50/50">
                No Clinical Evidence Recorded
            </div>
        );
    }

    const handleMediaClick = (url: string) => {
        setSelectedMedia(url);
    };

    const closeModal = () => {
        setSelectedMedia(null);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {urls.map((url, i) => {
                    const isVideo = isVideoUrl(url);
                    const driveUrl = convertDriveUrl(url);

                    return (
                        <div 
                            key={i} 
                            onClick={() => handleMediaClick(url)}
                            className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer hover:shadow-xl transition-all duration-300 ring-offset-2 hover:ring-2 hover:ring-primary/20"
                        >
                            {/* Media Content */}
                            {isVideo ? (
                                <div className="w-full h-full relative">
                                    <video 
                                        src={driveUrl} 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        preload="metadata"
                                    />
                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                                            <Play className="h-6 w-6 text-primary fill-primary" />
                                        </div>
                                    </div>
                                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-[9px] font-black text-white px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1.5">
                                        <FileVideo className="h-2.5 w-2.5" /> Motion
                                    </span>
                                </div>
                            ) : (
                                <div className="w-full h-full relative">
                                    <img 
                                        src={driveUrl} 
                                        alt="evidence" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-[9px] font-black text-white px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1.5">
                                        <FileImage className="h-2.5 w-2.5" /> Static
                                    </span>
                                </div>
                            )}

                            {/* View Hover Icon */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                                    <Maximize2 className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Cinematic Theater Mode (Lightbox) */}
            {selectedMedia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <button 
                        onClick={closeModal}
                        className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl transition-colors backdrop-blur-md border border-white/10"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <div className="relative w-full max-w-6xl max-h-full flex items-center justify-center overflow-hidden rounded-3xl border border-white/5 shadow-2xl bg-black">
                        {isVideoUrl(selectedMedia) ? (
                            <div className="w-full aspect-video bg-black flex items-center justify-center">
                                <video 
                                    src={convertDriveUrl(selectedMedia)} 
                                    controls 
                                    autoPlay
                                    className="max-w-full max-h-[85vh] shadow-2xl"
                                    playsInline
                                />
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center p-2">
                                <img 
                                    src={convertDriveUrl(selectedMedia)} 
                                    alt="Detailed view" 
                                    className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
                                />
                            </div>
                        )}
                        
                        {/* Footer Info in Modal */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                                    {isVideoUrl(selectedMedia) ? <FileVideo className="h-5 w-5 text-primary" /> : <FileImage className="h-5 w-5 text-primary" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Clinical Document</p>
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">Verified Media Assessment</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={closeModal} className="rounded-xl bg-white/10 border-white/10 hover:bg-white/20 text-white">
                                Close Review
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
