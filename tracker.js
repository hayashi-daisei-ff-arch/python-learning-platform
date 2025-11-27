// Progress tracking for Python Learning Platform

class ProgressTracker {
    constructor() {
        this.reset();
    }

    reset() {
        this.sessionStartTime = null;
        this.sessionEndTime = null;
        this.currentQuestionStartTime = null;
        this.questionsAnswered = 0;
        this.totalErrors = 0;
        this.currentQuestionErrors = 0;
        this.answerTimes = [];
        this.isSessionActive = false;
    }

    startSession() {
        // セッションが既にアクティブでない場合のみリセット
        if (!this.isSessionActive) {
            this.reset();
        }
        this.sessionStartTime = Date.now();
        this.isSessionActive = true;
    }

    endSession() {
        this.sessionEndTime = Date.now();
        this.isSessionActive = false;
    }

    startQuestion() {
        this.currentQuestionStartTime = Date.now();
        this.currentQuestionErrors = 0;
    }

    recordCorrectAnswer() {
        if (this.currentQuestionStartTime) {
            const answerTime = (Date.now() - this.currentQuestionStartTime) / 1000; // in seconds
            this.answerTimes.push(answerTime);
            this.questionsAnswered++;
            this.currentQuestionStartTime = null;
        }
    }

    recordError() {
        this.totalErrors++;
        this.currentQuestionErrors++;
    }

    getElapsedTime() {
        if (!this.sessionStartTime) return 0;
        const endTime = this.sessionEndTime || Date.now();
        return Math.floor((endTime - this.sessionStartTime) / 1000); // in seconds
    }

    getAverageAnswerTime() {
        if (this.answerTimes.length === 0) return 0;
        return calculateAverage(this.answerTimes);
    }

    getSessionDuration() {
        if (!this.sessionStartTime) return 0;
        if (!this.sessionEndTime) return 0;
        return Math.floor((this.sessionEndTime - this.sessionStartTime) / 1000 / 60); // in minutes
    }

    getStats() {
        return {
            questionsAnswered: this.questionsAnswered,
            totalErrors: this.totalErrors,
            currentQuestionErrors: this.currentQuestionErrors,
            averageAnswerTime: this.getAverageAnswerTime(),
            elapsedTime: this.getElapsedTime(),
            sessionDuration: this.getSessionDuration()
        };
    }

    getSessionData(userEmail, userName, courseId) {
        return {
            timestamp: getCurrentTimestamp(),
            email: userEmail,
            name: userName,
            courseId: courseId,              // ← "course" から "courseId" に変更
            questionsAnswered: this.questionsAnswered,
            totalErrors: this.totalErrors,
            elapsedTime: this.getElapsedTime(),  // ← "averageTime" から "elapsedTime" に変更
            startTime: this.sessionStartTime,     // ← 追加
            endTime: this.sessionEndTime          // ← 追加
        };
    }
}

// UI Update functions
function updateProgressDisplay(tracker, userName) {
    const stats = tracker.getStats();

    // Update user name
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
        userNameEl.textContent = userName;
    }

    // Update questions answered
    const questionsEl = document.getElementById('questions-count');
    if (questionsEl) {
        questionsEl.textContent = stats.questionsAnswered;
    }

    // Update current question errors
    const currentErrorsEl = document.getElementById('current-errors');
    if (currentErrorsEl) {
        currentErrorsEl.textContent = stats.currentQuestionErrors;
    }

    // Update total errors
    const totalErrorsEl = document.getElementById('total-errors');
    if (totalErrorsEl) {
        totalErrorsEl.textContent = stats.totalErrors;
    }

    // Update average answer time
    const avgTimeEl = document.getElementById('avg-time');
    if (avgTimeEl) {
        avgTimeEl.textContent = stats.averageAnswerTime > 0
            ? `${Math.round(stats.averageAnswerTime)}秒`
            : '-';
    }

    // Update elapsed time
    const elapsedTimeEl = document.getElementById('elapsed-time');
    if (elapsedTimeEl) {
        elapsedTimeEl.textContent = formatTime(stats.elapsedTime);
    }
}

// Timer for updating elapsed time
let progressUpdateInterval = null;

function startProgressTimer(tracker, userName) {
    stopProgressTimer();
    progressUpdateInterval = setInterval(() => {
        updateProgressDisplay(tracker, userName);
    }, 1000);
}

function stopProgressTimer() {
    if (progressUpdateInterval) {
        clearInterval(progressUpdateInterval);
        progressUpdateInterval = null;
    }
}
