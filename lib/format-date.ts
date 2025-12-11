/**
 * Format a date string to a readable format
 * Handles various date formats including ISO timestamps
 */
export function formatDate(dateString: string | undefined | null): string {
    if (!dateString) return 'N/A';

    try {
        // Try to parse the date
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateString; // Return original if can't parse
        }

        // Format as: "December 11, 2025"
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString; // Return original if error
    }
}

/**
 * Format a date string to short format
 * Example: "12/11/2025"
 */
export function formatDateShort(dateString: string | undefined | null): string {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return dateString;
        }

        // Format as: "12/11/2025"
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Format a timestamp to readable date and time
 * Example: "December 11, 2025 at 2:30 PM"
 */
export function formatDateTime(dateString: string | undefined | null): string {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        return dateString;
    }
}
