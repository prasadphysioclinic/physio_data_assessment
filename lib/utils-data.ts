/**
 * Data utility functions for sanitization, validation, and media handling
 */

// ─── Data Sanitization ───────────────────────────────────────────────
/**
 * Cleans form data before sending to Apps Script.
 * Converts undefined/null values to empty strings to prevent
 * "undefined" being stored literally in Google Sheets.
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            if (value === undefined || value === null) return [key, ""];
            if (typeof value === 'string') return [key, value.trim()];
            return [key, value];
        })
    ) as T;
}

/**
 * Strips the Data URI prefix from a base64 string (e.g., 'data:image/jpeg;base64,')
 * to provide raw base64 content to the backend.
 */
export function stripBase64Metadata(base64: string): string {
    if (!base64 || !base64.includes(',')) return base64;
    return base64.split(',')[1];
}

// ─── File Size Validation ────────────────────────────────────────────
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024;  // 20 MB

export function validateFileSize(file: File): { valid: boolean; error?: string } {
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const maxLabel = isVideo ? '20MB' : '5MB';
    const type = isVideo ? 'Video' : 'Image';

    if (file.size > maxSize) {
        const actualMB = (file.size / (1024 * 1024)).toFixed(1);
        return {
            valid: false,
            error: `${type} "${file.name}" is ${actualMB}MB. Maximum is ${maxLabel}.`
        };
    }
    return { valid: true };
}

// ─── Precision Media Parser (Systemic Re-Architecture) ────────────────
export interface ClinicalMediaInfo {
    id: string;
    mimeType: string;
    fileName: string;
    isVideo: boolean;
    thumbnailUrl: string;
    downloadUrl: string;
    previewUrl: string;
}

/**
 * Parses a media value from the sheet (structured string or fuzzy URL).
 * Precision: 100% for new structured data, high-effort fallback for legacy.
 */
export function parseClinicalMedia(val: string | undefined | null): ClinicalMediaInfo | null {
    if (!val || typeof val !== 'string') return null;
    const raw = val.trim();

    let gId = '';
    let mime = 'image/jpeg'; // Default assumption
    let name = 'clinical_evidence';

    // 1. New Structured Format: gId|mimeType|fileName
    if (raw.includes('|')) {
        const parts = raw.split('|');
        if (parts.length >= 2) {
            gId = parts[0];
            mime = parts[1];
            name = parts[2] || name;
        }
    } 
    // 2. Legacy Fallback (Fuzzy extraction)
    else {
        gId = extractDriveId(raw) || '';
        if (raw.toLowerCase().includes('mime=video') || 
            raw.toLowerCase().includes('.mp4') || 
            raw.toLowerCase().includes('.webm')) {
            mime = 'video/webm';
        }
    }

    if (!gId) return null;

    const isVideo = mime.startsWith('video/');
    
    return {
        id: gId,
        mimeType: mime,
        fileName: name,
        isVideo,
        // Resilient Snapshot: Official thumbnail engine for grid visibility
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${gId}&sz=w1200`,
        // High-Speed Direct Stream: Bypasses Google Drive "Processing" screens
        downloadUrl: `https://lh3.googleusercontent.com/d/${gId}`,
        // Official Preview: Bypasses CORB/Security blocks for motion playback
        previewUrl: `https://drive.google.com/file/d/${gId}/preview`
    };
}

function extractDriveId(url: string): string | null {
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/);
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
    const thumbMatch = url.match(/thumbnail\?id=([a-zA-Z0-9_-]{25,})/);
    const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]{25,})/);
    
    if (fileMatch) return fileMatch[1];
    if (openMatch) return openMatch[1];
    if (thumbMatch) return thumbMatch[1];
    if (ucMatch) return ucMatch[1];
    if (url.length >= 25 && !url.includes('/') && !url.includes(':')) return url;
    return null;
}

/**
 * Legacy support for existing logic
 */
export function convertDriveUrl(url: string | undefined | null, mode: 'download' | 'thumbnail' | 'preview' = 'download'): string {
    const info = parseClinicalMedia(url);
    if (!info) return url || '';
    if (mode === 'thumbnail') return info.thumbnailUrl;
    if (mode === 'preview') return info.previewUrl;
    return info.downloadUrl;
}

export function isVideoUrl(url: string | undefined | null): boolean {
    if (!url || typeof url !== 'string') return false;
    const info = parseClinicalMedia(url);
    if (info) return info.isVideo;

    // Deep fallback if parser fails
    const lower = url.toLowerCase();
    return lower.includes('.mp4') || lower.includes('.mov') || lower.includes('.webm') || 
           lower.includes('video/') || lower.includes('mime=video');
}

// ─── Duplicate Detection ─────────────────────────────────────────────
/**
 * Checks if an assessment already exists for a patient on a given date.
 */
export function checkDuplicate(
    assessments: any[],
    patientName: string,
    date: string,
    excludeIndex?: number
): boolean {
    return assessments.some((a, index) => {
        if (excludeIndex !== undefined && index === excludeIndex) return false;
        const nameMatch = String(a.PatientName || '').toLowerCase().trim() === String(patientName || '').toLowerCase().trim();
        const dateMatch = String(a.Date || '').split('T')[0] === String(date || '').split('T')[0];
        return nameMatch && dateMatch;
    });
}

// ─── Patient Grouping ────────────────────────────────────────────────
export interface PatientProfile {
    name: string;
    slug: string;
    totalVisits: number;
    lastVisitDate: string;
    latestPainScore: number | null;
    firstVisitDate: string;
    assessmentIndices: number[];
}

/**
 * Groups assessments by patient name to create patient profiles.
 */
export function groupByPatient(assessments: any[]): PatientProfile[] {
    const patientMap = new Map<string, PatientProfile>();

    assessments.forEach((a, index) => {
        const name = String(a.PatientName || 'Unknown').trim();
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        if (!patientMap.has(slug)) {
            patientMap.set(slug, {
                name,
                slug,
                totalVisits: 0,
                lastVisitDate: '',
                latestPainScore: null,
                firstVisitDate: a.Date || '',
                assessmentIndices: [],
            });
        }

        const profile = patientMap.get(slug)!;
        profile.totalVisits++;
        profile.assessmentIndices.push(index);

        // Track dates
        const currentDate = a.Date || '';
        if (currentDate > profile.lastVisitDate || !profile.lastVisitDate) {
            profile.lastVisitDate = currentDate;
            const pain = parseInt(a.PainIntensity_VAS);
            profile.latestPainScore = isNaN(pain) ? null : pain;
        }
        if (currentDate < profile.firstVisitDate || !profile.firstVisitDate) {
            profile.firstVisitDate = currentDate;
        }
    });

    // Sort by last visit date (most recent first)
    return Array.from(patientMap.values()).sort((a, b) =>
        (b.lastVisitDate || '').localeCompare(a.lastVisitDate || '')
    );
}

// ─── Pain History Extraction ─────────────────────────────────────────
export interface PainDataPoint {
    date: string;
    painScore: number;
    formattedDate: string;
}

/**
 * Extracts pain history data points for a patient across visits (for charts).
 */
export function extractPainHistory(assessments: any[], indices: number[]): PainDataPoint[] {
    return indices
        .map(i => assessments[i])
        .filter(a => a && a.PainIntensity_VAS !== undefined && a.PainIntensity_VAS !== '')
        .map(a => {
            const pain = parseInt(a.PainIntensity_VAS);
            return {
                date: a.Date || '',
                painScore: isNaN(pain) ? 0 : pain,
                formattedDate: a.Date ? new Date(a.Date).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', timeZone: 'Asia/Kolkata'
                }) : 'N/A',
            };
        })
        .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}

// ─── Image Compression for Speed ─────────────────────────────────────
/**
 * Compresses an image file before upload to save bandwidth and speed up Apps Script.
 */
export async function compressImage(file: File): Promise<{ base64: string; compressedFile: File }> {
    if (!file.type.startsWith('image/')) {
        // Not an image, return original
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ base64: reader.result as string, compressedFile: file });
            reader.readAsDataURL(file);
        });
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get compressed base64 (0.6 quality for better speed/size balance)
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                
                // Convert to File object
                const byteString = atob(compressedBase64.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: 'image/jpeg' });
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' });

                resolve({ base64: compressedBase64, compressedFile });
            };
        };
    });
}

/**
 * Estimates the size of the payload in bytes
 */
export function calculatePayloadSize(payload: any): number {
    const stringified = JSON.stringify(payload);
    return new Blob([stringified]).size;
}

export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
