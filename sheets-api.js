// Google Sheets API integration for Python Learning Platform

/**
 * Send session data to Google Sheets via Google Apps Script
 */
async function sendToGoogleSheets(sessionData) {
    try {
        const response = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Error sending data to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Validate Sheets API configuration
 */
function isSheetsConfigured() {
    return CONFIG.SHEETS_API_URL &&
        !CONFIG.SHEETS_API_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE');
}

/**
 * Show configuration warning if Sheets API is not set up
 */
function checkSheetsConfiguration() {
    if (!isSheetsConfigured()) {
        console.warn('Google Sheets API URL not configured. Data will not be saved.');
        return false;
    }
    return true;
}
