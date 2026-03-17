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
                                <video 
                                    src={convertDriveUrl(selectedMedia, 'download')} 
                                    className="relative z-10 w-full h-full max-h-[85vh] object-contain shadow-2xl scale-[1.02]"
                                    poster={convertDriveUrl(selectedMedia, 'thumbnail')}
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center bg-slate-900 group">
                                <img 
                                    src={convertDriveUrl(selectedMedia, 'download')} 
                                    alt="Detailed clinical view" 
                                    className="max-w-full max-h-full object-contain shadow-[0_0_80px_rgba(0,0,0,0.5)] scale-[1.02]" 
                                />
                            </div>
                        )}
                        
                        {/* Immersive Footer */}
                        <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black via-black/95 to-transparent flex justify-between items-end">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center border-2 border-primary/40 backdrop-blur-xl">
                                        {isVideoUrl(selectedMedia) ? <FileVideo className="h-8 w-8 text-primary" /> : <FileImage className="h-8 w-8 text-primary" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Certified Medical Evidence</p>
                                        </div>
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Diagnostic Clinical Review</h3>
                                    </div>
                                </div>
                                
                                {isVideoUrl(selectedMedia) && (
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md max-w-lg">
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Observation Mode</p>
                                        <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                                            The motion is currently looping for continuous observation. Use the <span className="text-primary font-black">Open Original</span> button if you need to download.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {isVideoUrl(selectedMedia) && (
                                    <Button 
                                        variant="default" 
                                        size="lg" 
                                        asChild
                                        className="h-16 rounded-2xl px-12 bg-primary hover:bg-primary/90 text-white font-black tracking-widest uppercase text-xs shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <a href={convertDriveUrl(selectedMedia, 'download')} target="_blank" rel="noopener noreferrer">
                                            Open Original Motion
                                        </a>
                                    </Button>
                                )}
                                <Button variant="outline" size="lg" onClick={closeModal} className="h-16 rounded-2xl px-10 bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold tracking-wider uppercase text-xs backdrop-blur-sm">
                                    Dismiss Session
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
