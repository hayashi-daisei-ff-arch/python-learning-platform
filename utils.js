// Utility functions for Python Learning Platform

/**
 * Seeded Random Number Generator
 * Uses a simple LCG (Linear Congruential Generator) algorithm
 */
class SeededRandom {
    constructor(seed) {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }

    next() {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

/**
 * Generate a numeric seed from a string
 */
function stringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

/**
 * Shuffle array using seeded random
 */
function shuffleArray(array, seed) {
    const rng = new SeededRandom(seed);
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = rng.nextInt(0, i);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

/**
 * Generate a random success code (alphanumeric string)
 */
function generateSuccessCode(questionId, userEmail, timestamp) {
    const seed = stringToSeed(questionId + userEmail + timestamp);
    const rng = new SeededRandom(seed);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 8; i++) {
        code += chars[rng.nextInt(0, chars.length - 1)];
    }

    return code;
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * Format time in seconds to MM:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format time in seconds to human-readable format
 */
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}時間${mins}分${secs}秒`;
    } else if (mins > 0) {
        return `${mins}分${secs}秒`;
    } else {
        return `${secs}秒`;
    }
}

/**
 * Normalize answer for comparison (trim, lowercase)
 */
function normalizeAnswer(answer) {
    if (typeof answer === 'string') {
        const trimmed = answer.trim();
        // 数値に変換可能な場合は数値として扱う
        const asNumber = Number(trimmed);
        if (!isNaN(asNumber) && trimmed !== '') {
            return asNumber;
        }
        return trimmed.toLowerCase();
    }
    if (typeof answer === 'number') {
        return answer;
    }
    if (Array.isArray(answer)) {
        return answer.map(a => normalizeAnswer(a)).sort();
    }
    return answer;
}

/**
 * Compare two answers for equality
 */
function compareAnswers(userAnswer, correctAnswer) {
    const normalized1 = normalizeAnswer(userAnswer);
    const normalized2 = normalizeAnswer(correctAnswer);

    if (Array.isArray(normalized1) && Array.isArray(normalized2)) {
        if (normalized1.length !== normalized2.length) return false;
        return normalized1.every((val, idx) => val === normalized2[idx]);
    }

    return normalized1 === normalized2;
}

/**
 * Show a toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

/**
 * Get current timestamp in ISO format
 */
function getCurrentTimestamp() {
    return new Date().toISOString();
}

/**
 * Calculate average from array of numbers
 */
function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return sum / numbers.length;
}
