// Configuration file for Python Learning Platform
const CONFIG = {
    // Google OAuth 2.0 Client ID
    // TODO: Replace with your actual Google OAuth Client ID
    // Get it from: https://console.cloud.google.com/apis/credentials
    GOOGLE_CLIENT_ID: '537299528854-nkfja0tu3saf4vjfsqbsfmn09ltlaabh.apps.googleusercontent.com',

    // Google Apps Script Web App URL (for secure Sheets access)
    // TODO: Replace with your deployed Google Apps Script Web App URL
    SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbwZzyM1AXY2uQ9V9AhELeVUb1JHKXAQYHNukG-jh9ZNo2napWSvMvFiV68Ph8QxnqJAWQ/exec',

    // Application Settings
    APP_NAME: 'Python学習プラットフォーム',

    // Role Configuration
    ROLES: {
        STUDENT: 'student',
        TEACHER: 'teacher'
    },

    // Teacher Email Addresses (full access to admin panel)
    TEACHER_EMAILS: [
        'hayashi-daisei-ff@s.takagigakuen.ac.jp',
        'daisei.hayashi@outlook.jp'
    ],

    // Allowed Domain for Student Login
    ALLOWED_STUDENT_DOMAIN: 's.takagigakuen.ac.jp',

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
