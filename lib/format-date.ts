/**
 * Format a date string to a readable format
 * Handles various date formats including ISO timestamps
 */
export function formatDate(dateString: string | undefined | null): string {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return dateString;
        }

        // Force Asia/Kolkata timezone for consistent server/client rendering
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Kolkata'
        });
    } catch (error) {
        return dateString;
    }
}

export function formatDateShort(dateString: string | undefined | null): string {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'Asia/Kolkata'
        });
    } catch (error) {
        return dateString;
    }
}

export function formatDateTime(dateString: string | undefined | null): string {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Returns current date or provided date in YYYY-MM-DD format, locked to IST
 */
export function getIndiaDateString(dateInput?: string | Date): string {
    const d = dateInput ? new Date(dateInput) : new Date();
    return new Intl.DateTimeFormat('en-CA', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        timeZone: 'Asia/Kolkata' 
    }).format(d);
}
