// Google Sheets API integration for Python Learning Platform

/**
 * Send session data to Google Sheets via Google Apps Script
 */
async function sendToGoogleSheets(sessionData) {
    try {
        console.log('Sending data to Google Sheets:', sessionData);

        const response = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors', // Changed from 'cors' to 'no-cors' for Google Apps Script
            headers: {
                'Content-Type': 'text/plain', // Changed to text/plain for no-cors
            },
            body: JSON.stringify(sessionData)
        });

        // Note: With no-cors mode, we can't read the response
        // But the request will still be sent to the server
        console.log('Data sent successfully (no-cors mode)');
        return { success: true, message: 'Data sent to Google Sheets' };

    } catch (error) {
        console.error('Error sending data to Google Sheets:', error);

        // Fallback: Try with redirect mode
        try {
            const fallbackResponse = await fetch(CONFIG.SHEETS_API_URL, {
                method: 'POST',
                redirect: 'follow',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(sessionData).toString()
            });

            console.log('Data sent via fallback method');
            return { success: true, message: 'Data sent via fallback method' };
        } catch (fallbackError) {
            console.error('Fallback method also failed:', fallbackError);
            return { success: false, error: error.message };
        }
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
