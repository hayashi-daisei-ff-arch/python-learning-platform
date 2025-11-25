// Main application logic for Python Learning Platform

// Global state
let currentUser = null;
let currentCourse = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let progressTracker = new ProgressTracker();

// User role management
function getUserRole(email) {
    return CONFIG.TEACHER_EMAILS.includes(email)
        ? CONFIG.ROLES.TEACHER
        : CONFIG.ROLES.STUDENT;
}

function isTeacher() {
    return currentUser && currentUser.role === CONFIG.ROLES.TEACHER;
}

function isAllowedDomain(email) {
    // Teachers can log in from any domain
    if (CONFIG.TEACHER_EMAILS.includes(email)) {
        return true;
    }
    // Students must use the allowed domain
    return email.endsWith('@' + CONFIG.ALLOWED_STUDENT_DOMAIN);
}

function updateAdminButtonVisibility() {
    const adminBtn = document.querySelector('.admin-btn');
    if (adminBtn) {
        adminBtn.style.display = isTeacher() ? 'inline-block' : 'none';
    }
}

// Google Sign-In initialization
function initGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
            theme: 'filled_blue',
            size: 'large',
            text: 'signin_with',
            locale: 'ja'
        }
    );
}

// Handle Google Sign-In response
function handleCredentialResponse(response) {
    const credential = response.credential;
    const payload = parseJwt(credential);

    // Check if email is from allowed domain
    if (!isAllowedDomain(payload.email)) {
        showToast(`ログインできません。学生は @${CONFIG.ALLOWED_STUDENT_DOMAIN} のメールアドレスを使用してください。`, 'error');
        return;
    }

    currentUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: getUserRole(payload.email)
    };

    onUserSignedIn();
}

// Parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Handle user signed in
function onUserSignedIn() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';

    // Update user info display
    document.getElementById('user-avatar').src = currentUser.picture;
    document.getElementById('user-name-display').textContent = currentUser.name;
    document.getElementById('user-email-display').textContent = currentUser.email;

    // Update admin button visibility
    updateAdminButtonVisibility();

    const roleText = isTeacher() ? '（教員）' : '';
    showToast(`ようこそ、${currentUser.name}さん！${roleText}`, 'success');
}

// Sign out
function signOut() {
    google.accounts.id.disableAutoSelect();
    currentUser = null;
    currentCourse = null;
    currentQuestions = [];
    currentQuestionIndex = 0;
    progressTracker.reset();
    stopProgressTimer();

    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('course-section').style.display = 'block';
    document.getElementById('quiz-section').style.display = 'none';

    showToast('ログアウトしました', 'info');
}

// Start course
function startCourse(courseId) {
    if (!currentUser) {
        showToast('先にログインしてください', 'error');
        return;
    }

    currentCourse = CONFIG.COURSES[courseId];
    if (!currentCourse) {
        showToast('コースが見つかりません', 'error');
        return;
    }

    // Get shuffled questions for this user
    currentQuestions = getShuffledQuestions(courseId, currentUser.email);
    currentQuestionIndex = 0;

    if (currentQuestions.length === 0) {
        showToast('このコースには問題がありません', 'error');
        return;
    }

    // Show quiz section
    document.getElementById('course-section').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';

    // Update course title
    document.getElementById('course-title').textContent = currentCourse.title;

    // Show start screen
    showStartScreen();
}

// Show start screen
function showStartScreen() {
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('question-area').style.display = 'none';
    document.getElementById('completion-screen').style.display = 'none';
    document.getElementById('total-questions').textContent = currentQuestions.length;
}

// Start quiz session
function startQuiz() {
    progressTracker.startSession();
    startProgressTimer(progressTracker, currentUser.name);

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-area').style.display = 'block';

    // Show first question
    showQuestion(0);

    showToast('学習を開始しました！', 'success');
}

// Show question
function showQuestion(index) {
    if (index >= currentQuestions.length) {
        showCompletionScreen();
        return;
    }

    currentQuestionIndex = index;
    const question = currentQuestions[index];

    // Start tracking this question
    progressTracker.startQuestion();

    // Update progress display
    updateProgressDisplay(progressTracker, currentUser.name);

    // Update progress bar
    const progress = ((index + 1) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent =
        `${index + 1} / ${currentQuestions.length} 問完了`;

    // Update question number
    document.getElementById('question-number').textContent = index + 1;
    document.getElementById('question-total').textContent = currentQuestions.length;

    // Update question text
    document.getElementById('question-text').textContent = question.question;

    // Render answer options based on question type
    const answerContainer = document.getElementById('answer-container');
    answerContainer.innerHTML = '';

    if (question.type === 'single') {
        renderSingleChoice(question, answerContainer);
    } else if (question.type === 'multiple') {
        renderMultipleChoice(question, answerContainer);
    } else if (question.type === 'text') {
        renderTextInput(question, answerContainer);
    }

    // Hide feedback and next button
    document.getElementById('feedback-area').style.display = 'none';
    document.getElementById('next-button').style.display = 'none';

    // Show submit button
    document.getElementById('submit-button').style.display = 'inline-block';
}

// Render single choice question
function renderSingleChoice(question, container) {
    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.className = 'answer-option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = option;
        radio.id = `option-${index}`;

        const span = document.createElement('span');
        span.textContent = option;

        label.appendChild(radio);
        label.appendChild(span);
        container.appendChild(label);
    });
}

// Render multiple choice question
function renderMultipleChoice(question, container) {
    const instruction = document.createElement('p');
    instruction.className = 'instruction';
    instruction.textContent = '※複数選択可能です';
    container.appendChild(instruction);

    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.className = 'answer-option';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'answer';
        checkbox.value = option;
        checkbox.id = `option-${index}`;

        const span = document.createElement('span');
        span.textContent = option;

        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
    });
}

// Render text input question
function renderTextInput(question, container) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'text-answer';
    input.className = 'text-input';
    input.placeholder = '回答を入力してください';
    container.appendChild(input);
}

// Submit answer
function submitAnswer() {
    const question = currentQuestions[currentQuestionIndex];
    let userAnswer;

    if (question.type === 'single') {
        const selected = document.querySelector('input[name="answer"]:checked');
        if (!selected) {
            showToast('回答を選択してください', 'error');
            return;
        }
        userAnswer = selected.value;
    } else if (question.type === 'multiple') {
        const selected = document.querySelectorAll('input[name="answer"]:checked');
        if (selected.length === 0) {
            showToast('少なくとも1つ選択してください', 'error');
            return;
        }
        userAnswer = Array.from(selected).map(cb => cb.value);
    } else if (question.type === 'text') {
        const input = document.getElementById('text-answer');
        if (!input.value.trim()) {
            showToast('回答を入力してください', 'error');
            return;
        }
        userAnswer = input.value;
    }

    // Check answer
    const isCorrect = compareAnswers(userAnswer, question.answer);

    if (isCorrect) {
        progressTracker.recordCorrectAnswer();
        showCorrectFeedback(question);
    } else {
        progressTracker.recordError();
        showIncorrectFeedback();
    }

    updateProgressDisplay(progressTracker, currentUser.name);
}

// Show correct feedback
function showCorrectFeedback(question) {
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.className = 'feedback-area correct';
    feedbackArea.style.display = 'block';

    // Generate success code
    const successCode = generateSuccessCode(
        question.id,
        currentUser.email,
        Date.now().toString()
    );

    feedbackArea.innerHTML = `
    <div class="feedback-icon">✓</div>
    <div class="feedback-message">正解です！</div>
    ${question.explanation ? `<div class="explanation">${question.explanation}</div>` : ''}
    <div class="success-code-container">
      <div class="success-code-label">確認コード:</div>
      <div class="success-code">${successCode}</div>
      <button class="copy-button" onclick="copySuccessCode('${successCode}')">
        <span class="copy-icon">📋</span> コピー
      </button>
    </div>
  `;

    document.getElementById('submit-button').style.display = 'none';
    document.getElementById('next-button').style.display = 'inline-block';

    // Disable answer inputs
    disableAnswerInputs();
}

// Show incorrect feedback
function showIncorrectFeedback() {
    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.className = 'feedback-area incorrect';
    feedbackArea.style.display = 'block';

    feedbackArea.innerHTML = `
    <div class="feedback-icon">✗</div>
    <div class="feedback-message">不正解です。もう一度考えてみましょう。</div>
  `;

    showToast('不正解です', 'error');
}

// Disable answer inputs
function disableAnswerInputs() {
    const inputs = document.querySelectorAll('#answer-container input');
    inputs.forEach(input => input.disabled = true);
}

// Copy success code
function copySuccessCode(code) {
    copyToClipboard(code).then(success => {
        if (success) {
            showToast('コードをコピーしました', 'success');
        } else {
            showToast('コピーに失敗しました', 'error');
        }
    });
}

// Next question
function nextQuestion() {
    showQuestion(currentQuestionIndex + 1);
}

// Show completion screen
function showCompletionScreen() {
    document.getElementById('question-area').style.display = 'none';
    document.getElementById('completion-screen').style.display = 'block';

    const stats = progressTracker.getStats();
    document.getElementById('final-questions').textContent = stats.questionsAnswered;
    document.getElementById('final-errors').textContent = stats.totalErrors;
    document.getElementById('final-time').textContent = formatDuration(stats.elapsedTime);
}

// End session
async function endSession() {
    progressTracker.endSession();
    stopProgressTimer();

    const sessionData = progressTracker.getSessionData(
        currentUser.email,
        currentUser.name,
        currentCourse.id
    );

    // Send to Google Sheets
    if (checkSheetsConfiguration()) {
        showToast('データを保存中...', 'info');
        const result = await sendToGoogleSheets(sessionData);

        if (result.success) {
            showToast('データを保存しました', 'success');
        } else {
            showToast('データの保存に失敗しました', 'error');
            console.error('Failed to save data:', result.error);
        }
    } else {
        showToast('注意: Google Sheetsが未設定のため、データは保存されません', 'warning');
    }

    // Return to course selection
    setTimeout(() => {
        returnToCourseSelection();
    }, 2000);
}

// Return to course selection
function returnToCourseSelection() {
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('course-section').style.display = 'block';
    document.getElementById('completion-screen').style.display = 'none';

    // Reset state
    currentCourse = null;
    currentQuestions = [];
    currentQuestionIndex = 0;
    progressTracker.reset();
}

// Initialize app
function initApp() {
    // Check if Google OAuth is configured
    if (!CONFIG.GOOGLE_CLIENT_ID || CONFIG.GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID_HERE')) {
        document.getElementById('config-warning').style.display = 'block';
        return;
    }

    initGoogleSignIn();
}

// Wait for Google Sign-In library to load
window.onload = function () {
    // Check if google.accounts is available
    if (typeof google !== 'undefined' && google.accounts) {
        initApp();
    } else {
        // Retry after a short delay
        setTimeout(() => {
            if (typeof google !== 'undefined' && google.accounts) {
                initApp();
            } else {
                document.getElementById('config-warning').style.display = 'block';
                document.getElementById('config-warning').innerHTML = `
          <h2>⚠️ エラー</h2>
          <p>Google Sign-In ライブラリの読み込みに失敗しました。</p>
          <p>インターネット接続を確認してページを再読み込みしてください。</p>
        `;
            }
        }, 1000);
    }
};
