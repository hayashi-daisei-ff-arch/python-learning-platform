# 🐍 Python学習プラットフォーム

Pythonの基礎を学ぶためのインタラクティブな学習プラットフォームです。Gmail認証、ランダム出題（再現性あり）、進捗管理、Google Sheetsへのデータ保存機能を備えています。

## ✨ 機能

- **Gmail認証**: Google OAuth 2.0による安全なログイン
- **コース管理**: 複数のコースを管理可能（現在は「Python入門」を実装）
- **ランダム出題**: ユーザーごとに固定シードでランダム化（再現性あり）
- **多様な問題形式**:
  - 単一選択問題
  - 複数選択問題
  - 記述問題（文字列・数値）
- **進捗追跡**:
  - 回答済み問題数
  - 現在の問題の誤答数
  - 合計誤答数
  - 平均回答時間
  - 経過時間
- **確認コード**: 正解時にランダム生成されたコードを表示（コピー機能付き）
- **データ保存**: Google Sheetsへの自動保存
- **モダンUI**: ダークモード、グラスモーフィズム、スムーズアニメーション

## 📋 必要要件

- Googleアカウント
- Google Cloud Projectアカウント
- モダンなWebブラウザ（Chrome、Firefox、Safari、Edge）

## 🚀 セットアップ

### 1. Google Cloud Projectの設定

#### OAuth 2.0認証情報の作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth クライアント ID」を選択
5. アプリケーションの種類: **ウェブアプリケーション**
6. 承認済みのJavaScript生成元を追加:
   - `http://localhost:8000`（ローカルテスト用）
   - `https://YOUR_GITHUB_USERNAME.github.io`（GitHub Pages用）
7. 「作成」をクリックし、**クライアントID**をコピー

#### Google Sheets APIの有効化

1. Google Cloud Consoleで「APIとサービス」→「ライブラリ」に移動
2. "Google Sheets API"を検索
3. 「有効にする」をクリック

### 2. Google Sheetsの設定

1. [Google Sheets](https://sheets.google.com/)で新しいスプレッドシートを作成
2. 以下の列名を1行目に追加:
   - `Timestamp`
   - `Email`
   - `Name`
   - `Course`
   - `Questions Answered`
   - `Total Errors`
   - `Average Time (seconds)`
   - `Session Duration (minutes)`

### 3. Google Apps Scriptの設定

Google Sheetsへのデータ書き込みを安全に行うため、Google Apps Scriptをバックエンドプロキシとして使用します。

1. Google Sheetsで「拡張機能」→「Apps Script」を開く
2. 以下のコードを貼り付け:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp,
      data.email,
      data.name,
      data.course,
      data.questionsAnswered,
      data.totalErrors,
      data.averageTime,
      data.sessionDuration
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. 「デプロイ」→「新しいデプロイ」を選択
4. 種類: **ウェブアプリ**
5. 実行ユーザー: **自分**
6. アクセスできるユーザー: **全員**
7. 「デプロイ」をクリックし、**ウェブアプリのURL**をコピー

### 4. プロジェクトの設定

1. このリポジトリをクローンまたはダウンロード
2. `config.js`ファイルを開く
3. 以下の値を設定:
   - `GOOGLE_CLIENT_ID`: Google OAuth Client ID
   - `SHEETS_API_URL`: Google Apps ScriptのウェブアプリURL

```javascript
const CONFIG = {
  GOOGLE_CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  SHEETS_API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  // ...
};
```

### 5. ローカルでのテスト

静的ファイルを提供するHTTPサーバーが必要です。

#### Python 3を使用する場合:
```bash
cd python-learning-platform
python -m http.server 8000
```

#### Node.jsを使用する場合:
```bash
npx http-server -p 8000
```

ブラウザで `http://localhost:8000` を開きます。

### 6. GitHub Pagesへのデプロイ

1. GitHubに新しいリポジトリを作成
2. ファイルをプッシュ:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. リポジトリの「Settings」→「Pages」に移動
4. Source: **main** ブランチ、**/ (root)** フォルダ
5. 「Save」をクリック
6. 数分後、`https://YOUR_USERNAME.github.io/YOUR_REPO/`でアクセス可能

⚠️ **重要**: GitHub PagesのURLをGoogle Cloud ConsoleのOAuth認証情報の「承認済みのJavaScript生成元」に追加してください。

## 📖 使い方

1. **ログイン**: Gmailアカウントでログイン
2. **コース選択**: 「Python入門」ボタンをクリック
3. **学習開始**: 「スタート」ボタンをクリック
4. **問題回答**: 
   - 問題を読んで回答を選択/入力
   - 「回答する」ボタンをクリック
   - 正解の場合、確認コードが表示されます（コピー可能）
   - 「次の問題へ」で次に進む
5. **終了**: 「終了」ボタンでセッションを終了し、データを保存

## 🎨 カスタマイズ

### 新しいコースの追加

1. `config.js`の`COURSES`に新しいコースを追加:
```javascript
COURSES: {
  'python-intro': { ... },
  'python-advanced': {
    id: 'python-advanced',
    title: 'Python応用',
    description: 'より高度なPythonの概念を学ぶ',
    icon: '🚀'
  }
}
```

2. `questions.js`に問題を追加:
```javascript
QUESTIONS['python-advanced'] = [
  {
    id: 'py-adv-001',
    course: 'python-advanced',
    type: 'single',
    question: '...',
    options: [...],
    answer: '...',
    explanation: '...'
  },
  // ...
];
```

3. `index.html`にコースカードを追加:
```html
<div class="course-card" onclick="startCourse('python-advanced')">
  <span class="course-icon">🚀</span>
  <h3>Python応用</h3>
  <p>より高度なPythonの概念を学ぶ</p>
</div>
```

### 問題の追加

`questions.js`に新しい問題オブジェクトを追加:

```javascript
{
  id: 'py-intro-021',  // ユニークなID
  course: 'python-intro',
  type: 'single',  // 'single', 'multiple', 'text'
  question: '問題文',
  options: ['選択肢1', '選択肢2', '選択肢3'],  // single/multipleの場合
  answer: '正解',  // または ['正解1', '正解2'] (multiple), '正解' (text)
  explanation: '解説（オプション）'
}
```

## 🔧 トラブルシューティング

### ログインできない

- Google Cloud ConsoleでOAuth認証情報が正しく設定されているか確認
- 承認済みのJavaScript生成元に現在のURLが含まれているか確認
- ブラウザのコンソールでエラーメッセージを確認

### データが保存されない

- Google Apps ScriptのウェブアプリURLが正しく設定されているか確認
- Apps Scriptのデプロイ設定で「アクセスできるユーザー: 全員」になっているか確認
- ブラウザのコンソールでネットワークエラーを確認

### 問題が表示されない

- `questions.js`が正しく読み込まれているか確認
- ブラウザのコンソールでJavaScriptエラーを確認
- 問題データの形式が正しいか確認

## 📊 データ構造

### Google Sheetsに保存されるデータ

| 列名 | 説明 | 例 |
|------|------|-----|
| Timestamp | セッション終了時刻 | 2025-11-25T02:30:00.000Z |
| Email | ユーザーのメールアドレス | user@example.com |
| Name | ユーザー名 | 山田太郎 |
| Course | コースID | python-intro |
| Questions Answered | 回答した問題数 | 20 |
| Total Errors | 合計誤答数 | 5 |
| Average Time (seconds) | 平均回答時間（秒） | 45.3 |
| Session Duration (minutes) | セッション時間（分） | 15 |

## 🛡️ セキュリティに関する注意

- OAuth Client IDは公開されても問題ありませんが、Client Secretは**絶対に公開しないでください**
- このプロジェクトではClient Secretを使用しない公開フローを使用しています
- Google Apps Scriptをプロキシとして使用することで、Sheets APIの認証情報を保護しています

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📧 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。
