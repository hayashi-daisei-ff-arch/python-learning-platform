// Question database for Python Learning Platform

const QUESTIONS = {
    'python-intro': [
        // Python Basics - Syntax and Keywords
        {
            id: 'py-intro-001',
            course: 'python-intro',
            type: 'single',
            question: 'Pythonで変数を定義する際、正しい構文はどれですか？',
            options: [
                'var x = 10',
                'int x = 10',
                'x = 10',
                'let x = 10'
            ],
            answer: 'x = 10',
            explanation: 'Pythonでは型宣言なしで変数を定義できます。'
        },
        {
            id: 'py-intro-002',
            course: 'python-intro',
            type: 'single',
            question: 'Pythonでコメントを書く際に使用する記号はどれですか？',
            options: [
                '//',
                '#',
                '/*',
                '--'
            ],
            answer: '#',
            explanation: 'Pythonでは#を使って1行コメントを書きます。'
        },
        {
            id: 'py-intro-003',
            course: 'python-intro',
            type: 'multiple',
            question: 'Pythonの予約語（キーワード）として正しいものをすべて選んでください。',
            options: [
                'if',
                'then',
                'for',
                'function',
                'def',
                'return'
            ],
            answer: ['if', 'for', 'def', 'return'],
            explanation: 'Pythonでは関数定義にdefを使い、thenやfunctionは予約語ではありません。'
        },

        // Data Types
        {
            id: 'py-intro-004',
            course: 'python-intro',
            type: 'single',
            question: 'type(3.14)の結果はどれですか？',
            options: [
                '<class \'int\'>',
                '<class \'float\'>',
                '<class \'str\'>',
                '<class \'double\'>'
            ],
            answer: '<class \'float\'>',
            explanation: '3.14は浮動小数点数なので、floatクラスです。'
        },
        {
            id: 'py-intro-005',
            course: 'python-intro',
            type: 'text',
            question: 'type("Hello")の結果を記述してください。（<class \'...\'>の形式で）',
            answer: '<class \'str\'>',
            explanation: '文字列はstrクラスです。'
        },
        {
            id: 'py-intro-006',
            course: 'python-intro',
            type: 'multiple',
            question: 'Pythonの不変（immutable）なデータ型をすべて選んでください。',
            options: [
                'int',
                'list',
                'str',
                'dict',
                'tuple',
                'set'
            ],
            answer: ['int', 'str', 'tuple'],
            explanation: 'int、str、tupleは不変です。list、dict、setは可変です。'
        },
        {
            id: 'py-intro-007',
            course: 'python-intro',
            type: 'single',
            question: 'リストとタプルの主な違いは何ですか？',
            options: [
                'リストは要素を追加できるが、タプルはできない',
                'タプルは要素を追加できるが、リストはできない',
                'リストは数値のみ、タプルは文字列のみ',
                '違いはない'
            ],
            answer: 'リストは要素を追加できるが、タプルはできない',
            explanation: 'リストは可変（mutable）、タプルは不変（immutable）です。'
        },

        // Simple Calculations
        {
            id: 'py-intro-008',
            course: 'python-intro',
            type: 'text',
            question: '10 // 3の結果を数値で答えてください。',
            answer: '3',
            explanation: '//は整数除算（floor division）で、小数点以下を切り捨てます。'
        },
        {
            id: 'py-intro-009',
            course: 'python-intro',
            type: 'text',
            question: '10 % 3の結果を数値で答えてください。',
            answer: '1',
            explanation: '%は剰余演算子で、割り算の余りを返します。'
        },
        {
            id: 'py-intro-010',
            course: 'python-intro',
            type: 'text',
            question: '2 ** 3の結果を数値で答えてください。',
            answer: '8',
            explanation: '**はべき乗演算子で、2の3乗は8です。'
        },
        {
            id: 'py-intro-011',
            course: 'python-intro',
            type: 'single',
            question: 'len([1, 2, 3, 4, 5])の結果はどれですか？',
            options: [
                '4',
                '5',
                '15',
                'エラー'
            ],
            answer: '5',
            explanation: 'len()はリストの要素数を返します。'
        },

        // String Operations
        {
            id: 'py-intro-012',
            course: 'python-intro',
            type: 'text',
            question: '"Hello" + " " + "World"の結果を記述してください。',
            answer: 'Hello World',
            explanation: '+演算子で文字列を連結できます。'
        },
        {
            id: 'py-intro-013',
            course: 'python-intro',
            type: 'text',
            question: '"Python" * 2の結果を記述してください。',
            answer: 'PythonPython',
            explanation: '*演算子で文字列を繰り返すことができます。'
        },

        // Error Debugging
        {
            id: 'py-intro-014',
            course: 'python-intro',
            type: 'single',
            question: '次のコードのエラーの原因は何ですか？\n\nprint(x)\nx = 10',
            options: [
                'printの構文エラー',
                '変数xが定義される前に使用されている',
                'x = 10の構文エラー',
                'エラーはない'
            ],
            answer: '変数xが定義される前に使用されている',
            explanation: 'Pythonでは変数を使用する前に定義する必要があります。'
        },
        {
            id: 'py-intro-015',
            course: 'python-intro',
            type: 'single',
            question: 'IndentationErrorが発生する原因として最も適切なものはどれですか？',
            options: [
                '変数名のスペルミス',
                'インデント（字下げ）が正しくない',
                '括弧の数が合わない',
                'セミコロンがない'
            ],
            answer: 'インデント（字下げ）が正しくない',
            explanation: 'IndentationErrorはインデントの不整合で発生します。'
        },
        {
            id: 'py-intro-016',
            course: 'python-intro',
            type: 'single',
            question: '次のコードを修正するにはどうすればよいですか？\n\nif x = 10:\n    print("x is 10")',
            options: [
                'x = 10をx == 10に変更',
                'print文を削除',
                'ifをwhileに変更',
                '修正不要'
            ],
            answer: 'x = 10をx == 10に変更',
            explanation: '条件式では比較演算子==を使い、代入演算子=は使いません。'
        },
        {
            id: 'py-intro-017',
            course: 'python-intro',
            type: 'multiple',
            question: 'TypeErrorが発生する可能性のあるコードをすべて選んでください。',
            options: [
                '"5" + 5',
                '5 + 5',
                'len(123)',
                '[1, 2] + [3, 4]',
                'int("abc")'
            ],
            answer: ['"5" + 5', 'len(123)', 'int("abc")'],
            explanation: '文字列と数値の加算、数値へのlen()適用、数値に変換できない文字列のint()はTypeErrorになります。'
        },

        // Boolean and Conditions
        {
            id: 'py-intro-018',
            course: 'python-intro',
            type: 'single',
            question: 'bool([])の結果はどれですか？',
            options: [
                'True',
                'False',
                'None',
                'エラー'
            ],
            answer: 'False',
            explanation: '空のリストはFalseと評価されます。'
        },
        {
            id: 'py-intro-019',
            course: 'python-intro',
            type: 'multiple',
            question: 'Falseと評価される値をすべて選んでください。',
            options: [
                '0',
                '1',
                '""',
                '"False"',
                'None',
                '[]'
            ],
            answer: ['0', '""', 'None', '[]'],
            explanation: '0、空文字列、None、空のリストはFalseと評価されます。"False"は空でない文字列なのでTrueです。'
        },

        // Functions
        {
            id: 'py-intro-020',
            course: 'python-intro',
            type: 'single',
            question: '関数を定義するキーワードはどれですか？',
            options: [
                'function',
                'def',
                'func',
                'define'
            ],
            answer: 'def',
            explanation: 'Pythonではdefキーワードで関数を定義します。'
        }
    ]
};

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
