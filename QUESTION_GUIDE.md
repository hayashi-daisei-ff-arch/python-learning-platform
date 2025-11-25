# 問題追加ガイド

このガイドでは、Python学習プラットフォームに新しい問題を追加する方法を説明します。

## 問題の構造

すべての問題は`questions.js`ファイルに定義されています。各問題は以下の構造を持つJavaScriptオブジェクトです：

```javascript
{
  id: 'py-intro-XXX',           // ユニークなID
  course: 'python-intro',       // コースID
  type: 'single',               // 問題タイプ: 'single', 'multiple', 'text'
  question: '問題文',           // 問題の内容
  options: ['選択肢1', ...],    // 選択肢（single/multipleの場合）
  answer: '正解',               // 正解（形式は問題タイプによる）
  explanation: '解説'           // 解説（オプション）
}
```

## 問題タイプ

### 1. 単一選択（single）

ユーザーは1つだけ選択できます。

```javascript
{
  id: 'py-intro-021',
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
}
```

**ポイント:**
- `options`: 文字列の配列
- `answer`: 正解の選択肢（文字列）
- 選択肢は4つ程度が推奨

### 2. 複数選択（multiple）

ユーザーは複数選択できます。

```javascript
{
  id: 'py-intro-022',
  course: 'python-intro',
  type: 'multiple',
  question: 'Pythonの予約語として正しいものをすべて選んでください。',
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
}
```

**ポイント:**
- `options`: 文字列の配列
- `answer`: 正解の選択肢の配列（文字列の配列）
- 正解は複数可能
- 選択肢の順序は自動的にソートされて比較されます

### 3. 記述式（text）

ユーザーはテキストを入力します。

```javascript
{
  id: 'py-intro-023',
  course: 'python-intro',
  type: 'text',
  question: '10 // 3の結果を数値で答えてください。',
  answer: '3',
  explanation: '//は整数除算（floor division）で、小数点以下を切り捨てます。'
}
```

**ポイント:**
- `options`: 不要（定義しない）
- `answer`: 正解の文字列または数値
- 大文字小文字は区別されません
- 前後の空白は自動的に削除されます

## 問題の追加手順

### ステップ1: questions.jsを開く

テキストエディタで`questions.js`を開きます。

### ステップ2: 問題を追加

`QUESTIONS['python-intro']`配列の最後に新しい問題オブジェクトを追加します：

```javascript
const QUESTIONS = {
  'python-intro': [
    // 既存の問題...
    {
      id: 'py-intro-020',
      // ...
    },
    // ↓ ここに新しい問題を追加
    {
      id: 'py-intro-021',
      course: 'python-intro',
      type: 'single',
      question: '新しい問題文',
      options: ['選択肢1', '選択肢2', '選択肢3'],
      answer: '選択肢1',
      explanation: '解説'
    }
  ]
};
```

### ステップ3: IDの採番

問題IDは以下のルールに従います：
- フォーマット: `py-intro-XXX`
- `XXX`: 3桁の連番（001, 002, ..., 021, ...）
- 既存の最大番号 + 1を使用

### ステップ4: 保存とテスト

1. ファイルを保存
2. ブラウザでページをリロード
3. 新しい問題が表示されることを確認

## ベストプラクティス

### 問題文の書き方

✅ **良い例:**
```javascript
question: 'type(3.14)の結果はどれですか？'
```

❌ **悪い例:**
```javascript
question: '次のうち正しいものは？'  // 何について聞いているか不明確
```

### 選択肢の作り方

✅ **良い例:**
```javascript
options: [
  '<class \'int\'>',
  '<class \'float\'>',
  '<class \'str\'>',
  '<class \'double\'>'
]
```

❌ **悪い例:**
```javascript
options: [
  'A',
  'B',
  'C',
  'D'
]  // 選択肢の内容が不明
```

### 解説の書き方

✅ **良い例:**
```javascript
explanation: '//は整数除算（floor division）で、小数点以下を切り捨てます。10÷3=3.333...なので、結果は3になります。'
```

❌ **悪い例:**
```javascript
explanation: '正解は3です。'  // なぜそうなるかの説明がない
```

## 問題のカテゴリ分け

問題を追加する際は、以下のカテゴリを参考にしてください：

1. **Python基礎**: 構文、キーワード、基本概念
2. **データ型**: int, float, str, list, tuple, dict, set, bool
3. **演算子**: 算術、比較、論理、代入
4. **制御構文**: if, for, while, break, continue
5. **関数**: def, return, 引数, デフォルト値
6. **エラー処理**: try, except, finally, raise
7. **文字列操作**: スライス、メソッド、フォーマット
8. **リスト操作**: append, extend, pop, sort
9. **辞書操作**: keys, values, items, get
10. **ファイル操作**: open, read, write, close

## 問題の難易度

問題を追加する際は、難易度を考慮してください：

- **初級**: 基本的な構文や概念
- **中級**: 複数の概念を組み合わせた問題
- **上級**: 実践的な問題やデバッグ

## 例: 完全な問題セット

```javascript
// 初級: 基本的な構文
{
  id: 'py-intro-021',
  course: 'python-intro',
  type: 'single',
  question: 'Pythonでコメントを書く際に使用する記号はどれですか？',
  options: ['//', '#', '/*', '--'],
  answer: '#',
  explanation: 'Pythonでは#を使って1行コメントを書きます。'
},

// 中級: データ型の理解
{
  id: 'py-intro-022',
  course: 'python-intro',
  type: 'multiple',
  question: 'Pythonの可変（mutable）なデータ型をすべて選んでください。',
  options: ['int', 'list', 'str', 'dict', 'tuple', 'set'],
  answer: ['list', 'dict', 'set'],
  explanation: 'list、dict、setは可変です。int、str、tupleは不変です。'
},

// 上級: 実践的な計算
{
  id: 'py-intro-023',
  course: 'python-intro',
  type: 'text',
  question: 'len([x for x in range(10) if x % 2 == 0])の結果を数値で答えてください。',
  answer: '5',
  explanation: 'range(10)は0-9の数値を生成し、偶数は0,2,4,6,8の5つです。'
}
```

## トラブルシューティング

### 問題が表示されない

- JavaScriptの構文エラーを確認
- ブラウザのコンソール（F12）でエラーをチェック
- カンマの位置を確認（最後の問題の後にカンマは不要）

### 正解が認識されない

- `answer`の値が`options`の値と完全に一致しているか確認
- 複数選択の場合、配列形式になっているか確認
- 記述式の場合、大文字小文字や空白を考慮

### 問題IDが重複している

- 各問題のIDはユニークである必要があります
- 既存のIDと重複しないように注意

## まとめ

1. `questions.js`を開く
2. 適切な問題タイプを選択
3. 問題オブジェクトを作成
4. 配列に追加
5. 保存してテスト

問題を追加することで、学習プラットフォームをより充実させることができます！
