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
                    const thumbnailUrl = convertDriveUrl(url, 'thumbnail');

                    return (
                        <div 
                            key={i} 
                            onClick={() => handleMediaClick(url)}
                            className="group relative aspect-square bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-50 cursor-pointer shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
                        >
                            {/* Visual Snapshot (Thubmnail - Always Visible) */}
                            <img 
                                src={thumbnailUrl} 
                                alt="clinical evidence" 
                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" 
                            />
                            
                            {/* Media Type Indicators */}
                            {isVideo ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
                                    <div className="bg-primary/95 text-white p-4 rounded-full shadow-2xl transform group-hover:scale-125 transition-all duration-300">
                                        <Play className="h-8 w-8 fill-white" />
                                    </div>
                                    <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xl text-[10px] font-black text-white px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-2 border border-white/10">
                                        <FileVideo className="h-3 w-3 text-primary" /> Motion Capture
                                    </span>
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xl text-[10px] font-black text-white px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-2 border border-white/10">
                                        <FileImage className="h-3 w-3 text-primary" /> Clinical Photo
                                    </span>
                                </div>
                            )}

                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white">
                                    <Maximize2 className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Cinematic Theater Mode (Full Experience) */}
            {selectedMedia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-12 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-300">
                    <button 
                        onClick={closeModal}
                        className="absolute top-8 right-8 z-50 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 p-4 rounded-3xl transition-all duration-300 backdrop-blur-xl border border-white/10 group"
                    >
                        <X className="h-8 w-8 group-hover:rotate-90 transition-transform" />
                    </button>

                    <div className="relative w-full h-full max-w-[1400px] flex items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-black">
                        {isVideoUrl(selectedMedia) ? (
                            <div className="w-full h-full relative flex items-center justify-center bg-black">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest animate-pulse">Initializing native player...</p>
                                    </div>
                                </div>
                                <iframe 
                                    src={convertDriveUrl(selectedMedia, 'preview')} 
                                    className="relative z-10 w-full h-full border-none"
                                    allow="autoplay"
                                    title="Clinical Motion Review"
                                />
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center bg-slate-900 group">
                                <img 
                                    src={convertDriveUrl(selectedMedia, 'download')} 
                                    alt="Detailed clinical view" 
                                    className="max-w-full max-h-full object-contain shadow-[0_0_80px_rgba(0,0,0,0.5)]" 
                                />
                            </div>
                        )}
                        
                        {/* Immersive Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-between items-end">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center border-2 border-primary/30 backdrop-blur-md">
                                        {isVideoUrl(selectedMedia) ? <FileVideo className="h-7 w-7 text-primary" /> : <FileImage className="h-7 w-7 text-primary" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Diagnostic Media</p>
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none">Diagnostic Clinical Review</h3>
                                    </div>
                                </div>
                                
                                {isVideoUrl(selectedMedia) && (
                                    <p className="text-white/40 text-[11px] font-medium max-w-md bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                        If the video does not play instantly due to browser restrictions, use the <span className="text-primary font-bold">Emergency Review</span> button.
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {isVideoUrl(selectedMedia) && (
                                    <Button 
                                        variant="secondary" 
                                        size="lg" 
                                        asChild
                                        className="h-14 rounded-2xl px-10 bg-primary hover:bg-primary/90 text-white font-black tracking-wider uppercase text-xs shadow-2xl shadow-primary/20 transition-all hover:scale-105"
                                    >
                                        <a href={convertDriveUrl(selectedMedia, 'download')} target="_blank" rel="noopener noreferrer">
                                            Emergency Review (Open Tab)
                                        </a>
                                    </Button>
                                )}
                                <Button variant="outline" size="lg" onClick={closeModal} className="h-14 rounded-2xl px-10 bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold tracking-wider uppercase text-xs">
                                    Dismiss Review
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
