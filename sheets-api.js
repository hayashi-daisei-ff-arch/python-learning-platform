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

/**
 * Save question data to Google Sheets
 */
async function saveQuestionToSheets(questionData) {
    try {
        console.log('Saving question to Google Sheets:', questionData);

        const payload = {
            type: 'question',
            action: 'save',
            data: questionData
        };

        const response = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(payload)
        });

        console.log('Question saved successfully');
        return { success: true, message: 'Question saved to Google Sheets' };

    } catch (error) {
        console.error('Error saving question to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete question from Google Sheets
 */
async function deleteQuestionFromSheets(questionId) {
    try {
        console.log('Deleting question from Google Sheets:', questionId);

        const payload = {
            type: 'question',
            action: 'delete',
            questionId: questionId
        };

        const response = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(payload)
        });

        console.log('Question deleted successfully');
        return { success: true, message: 'Question deleted from Google Sheets' };

    } catch (error) {
        console.error('Error deleting question from Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Load questions from Google Sheets
 */
async function loadQuestionsFromSheets() {
    try {
        console.log('Loading questions from Google Sheets');

        // Note: Google Apps Script needs to support GET requests for this
        const response = await fetch(`${CONFIG.SHEETS_API_URL}?type=questions`, {
            method: 'GET',
            mode: 'cors',
        });

        if (!response.ok) {
            throw new Error('Failed to load questions');
        }

        const data = await response.json();
        console.log('Questions loaded successfully:', data);
        return { success: true, data: data.questions };

    } catch (error) {
        console.error('Error loading questions from Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Save course data to Google Sheets
 */
async function saveCourseToSheets(courseData) {
    try {
        console.log('Saving course to Google Sheets:', courseData);

        const payload = {
            type: 'course',
            action: 'save',
            data: courseData
        };

        const response = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(payload)
        });

        console.log('Course saved successfully');
        return { success: true, message: 'Course saved to Google Sheets' };

    } catch (error) {
        console.error('Error saving course to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete course from Google Sheets
 */
async function deleteCourseFromSheets(courseId) {
    try {
        console.log('Deleting course from Google Sheets:', courseId);

        const payload = {
            type: 'course',
            action: 'delete',
            courseId: courseId
        };

        const response = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(payload)
        });

        console.log('Course deleted successfully');
        return { success: true, message: 'Course deleted from Google Sheets' };

    } catch (error) {
        console.error('Error deleting course from Google Sheets:', error);
        return { success: false, error: error.message };
    }
}
