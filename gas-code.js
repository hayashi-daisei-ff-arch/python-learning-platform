/**
 * Google Apps Script for Python Learning Platform
 * 
 * このスクリプトは以下のシートを使用します：
 * - "SessionData": 学習セッションの記録
 * - "Questions": 問題データ
 * - "Courses": コースデータ
 */

// POST リクエストを処理
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        // データタイプに応じて処理を分岐
        if (data.type === 'question') {
            return handleQuestionRequest(data);
        } else if (data.type === 'course') {
            return handleCourseRequest(data);
        } else {
            // セッションデータ（既存の処理）
            return handleSessionData(data);
        }
    } catch (error) {
        Logger.log('Error in doPost: ' + error.toString());
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// GET リクエストを処理（問題データの読み込み）
function doGet(e) {
    try {
        const type = e.parameter.type;

        if (type === 'questions') {
            return loadAllQuestions();
        } else if (type === 'courses') {  // ← 追加
            return loadAllCourses();        // ← 追加
        }

        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Unknown request type'
        })).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        Logger.log('Error in doGet: ' + error.toString());
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}
// セッションデータを処理（既存機能）
function handleSessionData(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('SessionData');

    // シートが存在しない場合は作成
    if (!sheet) {
        sheet = ss.insertSheet('SessionData');
        sheet.appendRow([
            'Timestamp',
            'Email',
            'Name',
            'Course ID',
            'Questions Answered',
            'Total Errors',
            'Elapsed Time (seconds)',
            'Start Time',
            'End Time'
        ]);
    }

    // データを追加
    sheet.appendRow([
        new Date(),
        data.email,
        data.name,
        data.courseId,
        data.questionsAnswered,
        data.totalErrors,
        data.elapsedTime,
        new Date(data.startTime),
        new Date(data.endTime)
    ]);

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Session data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
}

// 問題リクエストを処理
function handleQuestionRequest(data) {
    if (data.action === 'save') {
        return saveQuestion(data.data);
    } else if (data.action === 'delete') {
        return deleteQuestion(data.questionId);
    }

    return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
}

// 問題を保存
function saveQuestion(questionData) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Questions');

    // シートが存在しない場合は作成
    if (!sheet) {
        sheet = ss.insertSheet('Questions');
        sheet.appendRow([
            'Question ID',
            'Course ID',
            'Type',
            'Question Text',
            'Options (JSON)',
            'Answer (JSON)',
            'Explanation',
            'Created At'
        ]);
    }

    // 既存の問題を確認（更新の場合）
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] === questionData.id) {
            rowIndex = i + 1;
            break;
        }
    }

    const row = [
        questionData.id,
        questionData.course,
        questionData.type,
        questionData.question,
        JSON.stringify(questionData.options || []),
        JSON.stringify(questionData.answer),
        questionData.explanation || '',
        new Date()
    ];

    if (rowIndex > 0) {
        // 更新
        sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    } else {
        // 新規追加
        sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Question saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
}

// 問題を削除
function deleteQuestion(questionId) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Questions');

    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Questions sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] === questionId) {
            sheet.deleteRow(i + 1);
            return ContentService.createTextOutput(JSON.stringify({
                success: true,
                message: 'Question deleted successfully'
            })).setMimeType(ContentService.MimeType.JSON);
        }
    }

    return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Question not found'
    })).setMimeType(ContentService.MimeType.JSON);
}

// 全ての問題を読み込み
function loadAllQuestions() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Questions');

    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            questions: {}
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const questions = {};

    // ヘッダー行をスキップ
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const courseId = row[1];

        if (!questions[courseId]) {
            questions[courseId] = [];
        }

        questions[courseId].push({
            id: row[0],
            course: row[1],
            type: row[2],
            question: row[3],
            options: row[4] ? JSON.parse(row[4]) : [],
            answer: row[5] ? JSON.parse(row[5]) : '',
            explanation: row[6] || ''
        });
    }

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        questions: questions
    })).setMimeType(ContentService.MimeType.JSON);
}

// コースリクエストを処理
function handleCourseRequest(data) {
    if (data.action === 'save') {
        return saveCourse(data.data);
    } else if (data.action === 'delete') {
        return deleteCourse(data.courseId);
    }

    return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
}

// コースを保存
function saveCourse(courseData) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Courses');

    // シートが存在しない場合は作成
    if (!sheet) {
        sheet = ss.insertSheet('Courses');
        sheet.appendRow([
            'Course ID',
            'Title',
            'Description',
            'Icon',
            'Created At'
        ]);
    }

    // 既存のコースを確認（更新の場合）
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] === courseData.id) {
            rowIndex = i + 1;
            break;
        }
    }

    const row = [
        courseData.id,
        courseData.title,
        courseData.description,
        courseData.icon,
        new Date()
    ];

    if (rowIndex > 0) {
        // 更新
        sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    } else {
        // 新規追加
        sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Course saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
}

// コースを削除
function deleteCourse(courseId) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Courses');

    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Courses sheet not found'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (data[i][0] === courseId) {
            sheet.deleteRow(i + 1);
            return ContentService.createTextOutput(JSON.stringify({
                success: true,
                message: 'Course deleted successfully'
            })).setMimeType(ContentService.MimeType.JSON);
        }
    }

    return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Course not found'
    })).setMimeType(ContentService.MimeType.JSON);
}

// 全てのコースを読み込み
function loadAllCourses() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Courses');

    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            courses: {}
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const courses = {};

    // ヘッダー行をスキップ
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const courseId = row[0];

        courses[courseId] = {
            id: row[0],
            title: row[1],
            description: row[2],
            icon: row[3]
        };
    }

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        courses: courses
    })).setMimeType(ContentService.MimeType.JSON);
}