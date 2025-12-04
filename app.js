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
async function onUserSignedIn() {  // ← asyncを追加
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

    // Load questions from Google Sheets  ← この2行を追加
    await loadQuestionsOnLogin();
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
// Start course
function startCourse(courseId) {
    if (!currentUser) {
        showToast('先にログインしてください', 'error');
        return;
    }

    const selectedCourse = CONFIG.COURSES[courseId];
    if (!selectedCourse) {
        showToast('コースが見つかりません', 'error');
        return;
    }

    // 同じコースを再度選択した場合は、問題リストを再取得しない
    if (!currentCourse || currentCourse.id !== courseId) {
        currentCourse = selectedCourse;
        // Get shuffled questions for this user
        currentQuestions = getShuffledQuestions(courseId, currentUser.email);
    }

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
// Start quiz session
function startQuiz() {
    // タイマーが停止している場合のみ開始
    if (!progressUpdateInterval) {
        // セッションタイムのみ更新（リセットしない）
        if (!progressTracker.sessionStartTime) {
            progressTracker.sessionStartTime = Date.now();
        }
        progressTracker.isSessionActive = true;
        startProgressTimer(progressTracker, currentUser.name);
    }

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('question-area').style.display = 'block';

    // 進捗に応じて適切な問題を表示（回答済み問題数から継続）
    const nextQuestionIndex = progressTracker.questionsAnswered;
    showQuestion(nextQuestionIndex);

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
        // Show loading overlay
        document.getElementById('loading-overlay').style.display = 'flex';

        const result = await sendToGoogleSheets(sessionData);

        // Hide loading overlay
        document.getElementById('loading-overlay').style.display = 'none';

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
}

// Return to home (course selection)
function returnToHome() {
    // Hide admin section if open
    document.getElementById('admin-section').style.display = 'none';

    // Show course selection
    returnToCourseSelection();

    showToast('ホーム画面に戻りました', 'info');
}

// Reset progress for current course
function resetProgress() {
    if (!confirm('進捗をリセットしますか？問題は最初から始まります。')) {
        return;
    }

    // Reset progress tracker
    progressTracker.reset();

    // Reset question index
    currentQuestionIndex = 0;

    // Update display
    updateProgressDisplay(progressTracker, currentUser.name);

    // Reset progress bar
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('progress-text').textContent = '0 / ' + currentQuestions.length + ' 問完了';

    showToast('進捗をリセットしました', 'success');
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

// ログイン時に問題とコースを読み込む関数
// ログイン時に問題とコースを読み込む関数
async function loadQuestionsOnLogin() {
    if (!checkSheetsConfiguration()) {
        showToast('Google Sheets未設定のため、問題を読み込めません', 'warning');
        return;
    }

    // Show loading overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    try {
        // 問題を読み込み
        const questionsResult = await loadQuestionsFromSheets();
        if (questionsResult.success && questionsResult.data) {
            Object.assign(QUESTIONS, questionsResult.data);
            console.log('Questions loaded:', Object.keys(questionsResult.data).length, 'courses');
        }

        // コースを読み込み
        const coursesResult = await loadCoursesFromSheets();
        if (coursesResult.success && coursesResult.data) {
            Object.assign(CONFIG.COURSES, coursesResult.data);
            console.log('Courses loaded:', Object.keys(coursesResult.data).length, 'courses');
        }

        // コースカードを再読み込み
        loadCourseCards();

        // 結果を表示
        const questionCount = questionsResult.success ? Object.keys(questionsResult.data || {}).length : 0;
        const courseCount = coursesResult.success ? Object.keys(coursesResult.data || {}).length : 0;

        if (questionCount > 0 || courseCount > 0) {
            showToast(`データ読み込み完了: コース${courseCount}件`, 'success');
        } else {
            showToast('データが見つかりませんでした', 'info');
        }

    } catch (error) {
        console.error('Error loading data:', error);
        showToast('データの読み込み中にエラーが発生しました', 'error');
    } finally {
        // Hide loading overlay
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    }
}

// Load course cards dynamically
function loadCourseCards() {
    const grid = document.querySelector('.course-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const courses = Object.values(CONFIG.COURSES);

    if (courses.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                <p>現在利用可能なコースはありません。</p>
                <p>管理者に連絡するか、後で再度確認してください。</p>
            </div>
        `;
        return;
    }

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.onclick = () => startCourse(course.id);
        card.innerHTML = `
      <span class="course-icon">${course.icon}</span>
      <h3>${course.title}</h3>
      <p>${course.description}</p>
    `;
        grid.appendChild(card);
    });
}