// Question database for Python Learning Platform
// Questions are now loaded from Google Sheets

const QUESTIONS = {};

/**
 * Get questions for a specific course
 */
function getQuestionsByCourse(courseId) {
    return QUESTIONS[courseId] || [];
}

/**
 * Get shuffled questions using seeded random
 */
function getShuffledQuestions(courseId, userEmail) {
    const questions = getQuestionsByCourse(courseId);
    if (questions.length === 0) return [];

    // Generate seed from user email + course ID
    const seedString = userEmail + courseId;
    const seed = stringToSeed(seedString);

    return shuffleArray(questions, seed);
}

/**
 * Get a specific question by ID
 */
function getQuestionById(questionId) {
    for (const courseId in QUESTIONS) {
        const question = QUESTIONS[courseId].find(q => q.id === questionId);
        if (question) return question;
    }
    return null;
}
