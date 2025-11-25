// Admin panel functionality for Python Learning Platform

// Admin state
let adminMode = false;
let currentEditingQuestion = null;

// Toggle admin panel
function toggleAdminPanel() {
    // Check if user is a teacher
    if (!isTeacher()) {
        showToast('管理機能は教員ユーザーのみ利用可能です', 'error');
        return;
    }

    adminMode = !adminMode;

    if (adminMode) {
        document.getElementById('course-section').style.display = 'none';
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        loadAdminData();
    } else {
        document.getElementById('admin-section').style.display = 'none';
        document.getElementById('course-section').style.display = 'block';
    }
}

// Switch admin tabs
function switchAdminTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab contents
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab
    document.querySelector(`[onclick="switchAdminTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Load admin data
function loadAdminData() {
    loadQuestionsList();
    loadCoursesList();
}

// Load questions list
function loadQuestionsList() {
    const container = document.getElementById('questions-list');
    container.innerHTML = '';

    for (const courseId in QUESTIONS) {
        const questions = QUESTIONS[courseId];
        questions.forEach(question => {
            const item = document.createElement('div');
            item.className = 'question-item';
            item.innerHTML = `
        <div class="question-item-info">
          <div class="question-item-id">${question.id}</div>
          <div class="question-item-text">${question.question.substring(0, 80)}...</div>
        </div>
        <div class="question-item-actions">
          <button class="btn-edit" onclick="editQuestion('${question.id}')">編集</button>
          <button class="btn-delete" onclick="deleteQuestion('${question.id}')">削除</button>
        </div>
      `;
            container.appendChild(item);
        });
    }
}

// Load courses list
function loadCoursesList() {
    const container = document.getElementById('courses-list');
    container.innerHTML = '';

    for (const courseId in CONFIG.COURSES) {
        const course = CONFIG.COURSES[courseId];
        const item = document.createElement('div');
        item.className = 'question-item';
        item.innerHTML = `
      <div class="question-item-info">
        <div class="question-item-id">${course.id}</div>
        <div class="question-item-text">${course.icon} ${course.title} - ${course.description}</div>
      </div>
      <div class="question-item-actions">
        <button class="btn-edit" onclick="editCourse('${course.id}')">編集</button>
        <button class="btn-delete" onclick="deleteCourse('${course.id}')">削除</button>
      </div>
    `;
        container.appendChild(item);
    }
}

// Add new question
function addNewQuestion() {
    const courseId = document.getElementById('question-course').value;
    const questionType = document.getElementById('question-type').value;
    const questionText = document.getElementById('question-text-input').value;
    const explanation = document.getElementById('question-explanation').value;

    if (!courseId || !questionText) {
        showToast('コースIDと問題文は必須です', 'error');
        return;
    }

    // Generate new question ID
    const existingQuestions = QUESTIONS[courseId] || [];
    const maxId = existingQuestions.length > 0
        ? Math.max(...existingQuestions.map(q => parseInt(q.id.split('-').pop())))
        : 0;
    const newId = `py-${courseId.split('-')[1]}-${String(maxId + 1).padStart(3, '0')}`;

    const newQuestion = {
        id: newId,
        course: courseId,
        type: questionType,
        question: questionText,
        explanation: explanation
    };

    // Add options for choice questions
    if (questionType === 'single' || questionType === 'multiple') {
        const options = [];
        document.querySelectorAll('.option-input-group input').forEach(input => {
            if (input.value.trim()) {
                options.push(input.value.trim());
            }
        });
        newQuestion.options = options;

        // Get answer
        const answerInput = document.getElementById('question-answer').value;
        if (questionType === 'multiple') {
            newQuestion.answer = answerInput.split(',').map(a => a.trim());
        } else {
            newQuestion.answer = answerInput.trim();
        }
    } else {
        // Text question
        newQuestion.answer = document.getElementById('question-answer').value.trim();
    }

    // Add to QUESTIONS
    if (!QUESTIONS[courseId]) {
        QUESTIONS[courseId] = [];
    }
    QUESTIONS[courseId].push(newQuestion);

    showToast('問題を追加しました', 'success');
    clearQuestionForm();
    loadQuestionsList();

    // Save to localStorage
    saveQuestionsToStorage();
}

// Edit question
function editQuestion(questionId) {
    // Find question
    let question = null;
    for (const courseId in QUESTIONS) {
        question = QUESTIONS[courseId].find(q => q.id === questionId);
        if (question) break;
    }

    if (!question) return;

    currentEditingQuestion = questionId;

    // Fill form
    document.getElementById('question-course').value = question.course;
    document.getElementById('question-type').value = question.type;
    document.getElementById('question-text-input').value = question.question;
    document.getElementById('question-explanation').value = question.explanation || '';

    if (question.type === 'single' || question.type === 'multiple') {
        // Load options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        question.options.forEach(option => {
            addOptionInput(option);
        });

        // Set answer
        if (question.type === 'multiple') {
            document.getElementById('question-answer').value = question.answer.join(', ');
        } else {
            document.getElementById('question-answer').value = question.answer;
        }
    } else {
        document.getElementById('question-answer').value = question.answer;
    }

    // Switch to add question tab
    switchAdminTab('add-question');

    // Change button text
    document.querySelector('#add-question-tab .btn-save').textContent = '更新';
}

// Delete question
function deleteQuestion(questionId) {
    if (!confirm('この問題を削除しますか？')) return;

    for (const courseId in QUESTIONS) {
        const index = QUESTIONS[courseId].findIndex(q => q.id === questionId);
        if (index !== -1) {
            QUESTIONS[courseId].splice(index, 1);
            showToast('問題を削除しました', 'success');
            loadQuestionsList();
            saveQuestionsToStorage();
            return;
        }
    }
}

// Add new course
function addNewCourse() {
    const courseId = document.getElementById('course-id').value;
    const courseTitle = document.getElementById('course-title').value;
    const courseDescription = document.getElementById('course-description').value;
    const courseIcon = document.getElementById('course-icon').value;

    if (!courseId || !courseTitle) {
        showToast('コースIDとタイトルは必須です', 'error');
        return;
    }

    CONFIG.COURSES[courseId] = {
        id: courseId,
        title: courseTitle,
        description: courseDescription,
        icon: courseIcon || '📚'
    };

    showToast('コースを追加しました', 'success');
    clearCourseForm();
    loadCoursesList();
    saveCoursesToStorage();

    // Reload course cards
    loadCourseCards();
}

// Edit course
function editCourse(courseId) {
    const course = CONFIG.COURSES[courseId];
    if (!course) return;

    document.getElementById('course-id').value = course.id;
    document.getElementById('course-title').value = course.title;
    document.getElementById('course-description').value = course.description;
    document.getElementById('course-icon').value = course.icon;

    switchAdminTab('add-course');
    document.querySelector('#add-course-tab .btn-save').textContent = '更新';
}

// Delete course
function deleteCourse(courseId) {
    if (!confirm('このコースを削除しますか？関連する問題も削除されます。')) return;

    delete CONFIG.COURSES[courseId];
    delete QUESTIONS[courseId];

    showToast('コースを削除しました', 'success');
    loadCoursesList();
    saveCoursesToStorage();
    saveQuestionsToStorage();
    loadCourseCards();
}

// Add option input
function addOptionInput(value = '') {
    const container = document.getElementById('options-container');
    const group = document.createElement('div');
    group.className = 'option-input-group';
    group.innerHTML = `
    <input type="text" placeholder="選択肢" value="${value}">
    <button onclick="this.parentElement.remove()">削除</button>
  `;
    container.appendChild(group);
}

// Clear question form
function clearQuestionForm() {
    document.getElementById('question-course').value = '';
    document.getElementById('question-type').value = 'single';
    document.getElementById('question-text-input').value = '';
    document.getElementById('question-answer').value = '';
    document.getElementById('question-explanation').value = '';
    document.getElementById('options-container').innerHTML = '';
    currentEditingQuestion = null;
    document.querySelector('#add-question-tab .btn-save').textContent = '追加';
}

// Clear course form
function clearCourseForm() {
    document.getElementById('course-id').value = '';
    document.getElementById('course-title').value = '';
    document.getElementById('course-description').value = '';
    document.getElementById('course-icon').value = '';
    document.querySelector('#add-course-tab .btn-save').textContent = '追加';
}

// Save questions to localStorage
function saveQuestionsToStorage() {
    localStorage.setItem('python-learning-questions', JSON.stringify(QUESTIONS));
}

// Save courses to localStorage
function saveCoursesToStorage() {
    localStorage.setItem('python-learning-courses', JSON.stringify(CONFIG.COURSES));
}

// Load questions from localStorage
function loadQuestionsFromStorage() {
    const saved = localStorage.getItem('python-learning-questions');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(QUESTIONS, loaded);
    }
}

// Load courses from localStorage
function loadCoursesFromStorage() {
    const saved = localStorage.getItem('python-learning-courses');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(CONFIG.COURSES, loaded);
    }
}

// Load course cards dynamically
function loadCourseCards() {
    const grid = document.querySelector('.course-grid');
    if (!grid) return;

    grid.innerHTML = '';

    for (const courseId in CONFIG.COURSES) {
        const course = CONFIG.COURSES[courseId];
        const card = document.createElement('div');
        card.className = 'course-card';
        card.onclick = () => startCourse(courseId);
        card.innerHTML = `
      <span class="course-icon">${course.icon}</span>
      <h3>${course.title}</h3>
      <p>${course.description}</p>
    `;
        grid.appendChild(card);
    }
}

// Initialize admin on page load
window.addEventListener('load', () => {
    loadQuestionsFromStorage();
    loadCoursesFromStorage();
    loadCourseCards();
});
