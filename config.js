// Configuration file for Python Learning Platform
const CONFIG = {
    // Google OAuth 2.0 Client ID
    // TODO: Replace with your actual Google OAuth Client ID
    // Get it from: https://console.cloud.google.com/apis/credentials
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com',

    // Google Apps Script Web App URL (for secure Sheets access)
    // TODO: Replace with your deployed Google Apps Script Web App URL
    SHEETS_API_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',

    // Application Settings
    APP_NAME: 'Python学習プラットフォーム',

    // Course Configuration
    COURSES: {
        'python-intro': {
            id: 'python-intro',
            title: 'Python入門',
            description: 'Pythonの基礎を学ぶコース',
            icon: '🐍'
        }
        // Future courses can be added here
        // 'python-advanced': { ... }
    },

    // Question Settings
    QUESTION_SETTINGS: {
        // Use fixed seed for reproducible randomization
        USE_FIXED_SEED: true,
        // Show explanations after correct answer
        SHOW_EXPLANATIONS: true
    },

    // UI Settings
    UI_SETTINGS: {
        // Show elapsed time during session
        SHOW_TIMER: true,
        // Auto-scroll to next question
        AUTO_SCROLL: true
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
