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

// ─── Google Drive URL Conversion ─────────────────────────────────────
/**
 * Converts Google Drive share URLs to embeddable preview URLs.
 * 
 * Input:  https://drive.google.com/file/d/FILE_ID/view
 * Output: https://drive.google.com/uc?export=view&id=FILE_ID
 * 
 * Also handles /open?id= format and direct uc? links.
 */
export function convertDriveUrl(url: string | undefined | null): string {
    if (!url || typeof url !== 'string') return '';

    // Already a direct preview link
    if (url.includes('uc?export=view')) return url;

    // Standard /file/d/ID/view or /file/d/ID/edit format
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
        return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
    }

    // /open?id=ID format
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
        return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
    }

    // Return as-is if not a Drive URL
    return url;
}

/**
 * Check if a URL is a video based on its content or filename
 */
export function isVideoUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();
    return lower.includes('mp4') || lower.includes('mov') || lower.includes('video') || lower.includes('webm');
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
