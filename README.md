# 🐍 Python学習プラットフォーム

Pythonの基礎を学ぶためのインタラクティブな学習プラットフォームです。Gmail認証、ランダム出題（再現性あり）、進捗管理、Google Sheetsへのデータ保存機能を備えています。

> **汎用性**: このプラットフォームは、Python以外の科目や内容にも簡単にカスタマイズできます。詳細は[カスタマイズガイド](#-カスタマイズガイド)をご覧ください。

## 📑 目次

- [機能](#-機能)
- [クイックスタート](#-クイックスタート)
- [詳細セットアップ](#-詳細セットアップ)
- [カスタマイズガイド](#-カスタマイズガイド)
- [デプロイ](#-デプロイ)
- [使い方](#-使い方)
- [トラブルシューティング](#-トラブルシューティング)
- [技術仕様](#-技術仕様)

---

## ✨ 機能

### 認証・アクセス制御
- **Gmail認証**: Google OAuth 2.0による安全なログイン
- **ドメイン制限**: 特定ドメインのメールアドレスのみアクセス可能
- **ロールベースアクセス**: 教員のみ管理パネルにアクセス可能

### 学習機能
- **コース管理**: 複数のコースを管理可能
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

### 管理機能
- **問題管理**: 問題の追加・編集・削除
- **コース管理**: コースの追加・編集・削除
- **データ管理**: Google Sheetsとの連携

### UI/UX
- **モダンUI**: ダークモード、グラスモーフィズム、スムーズアニメーション
- **レスポンシブデザイン**: PC・タブレット・スマートフォン対応

---

## 🚀 クイックスタート

最小限の手順で動作確認を行う場合：

1. **Google OAuth Client IDの取得**
   - [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
   - OAuth 2.0 Client IDを作成（詳細は[詳細セットアップ](#-詳細セットアップ)参照）

2. **設定ファイルの編集**
   ```javascript
   // config.js
   GOOGLE_CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
   ```

3. **ローカルサーバーの起動**
   ```bash
   python -m http.server 8000
   ```

4. **ブラウザでアクセス**
   - `http://localhost:8000` を開く

> **注意**: この段階ではGoogle Sheetsへのデータ保存は機能しません。完全な機能を使用するには[詳細セットアップ](#-詳細セットアップ)を参照してください。

---

## 📋 詳細セットアップ

### 必要要件

- Googleアカウント
- Google Cloud Projectアカウント
- モダンなWebブラウザ（Chrome、Firefox、Safari、Edge）

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

#### 学習履歴保存用シートの作成

1. [Google Sheets](https://sheets.google.com/)で新しいスプレッドシートを作成
2. シート名を「学習履歴」に変更
3. 以下の列名を1行目に追加:
   - `Timestamp`
   - `Email`
   - `Name`
   - `CourseID`
   - `Questions Answered`
   - `Total Errors`
   - `Elapsed Time (seconds)`
   - `Start Time`
   - `End Time`

#### 問題データ用シートの作成（オプション）

1. 同じスプレッドシート内に新しいシート「問題データ」を作成
2. 以下の列名を1行目に追加:
   - `ID`
   - `CourseID`
   - `Type`
   - `Question`
   - `Options` (JSON形式)
   - `Answer`
   - `Explanation`

#### コースデータ用シートの作成（オプション）

1. 同じスプレッドシート内に新しいシート「コースデータ」を作成
2. 以下の列名を1行目に追加:
   - `ID`
   - `Title`
   - `Description`
   - `Icon`

### 3. Google Apps Scriptの設定

Google Sheetsへのデータ読み書きを安全に行うため、Google Apps Scriptをバックエンドプロキシとして使用します。

1. Google Sheetsで「拡張機能」→「Apps Script」を開く
2. プロジェクト内の`gas-code.js`ファイルの内容をコピー＆ペースト
3. 「デプロイ」→「新しいデプロイ」を選択
4. 種類: **ウェブアプリ**
5. 実行ユーザー: **自分**
6. アクセスできるユーザー: **全員**
7. 「デプロイ」をクリックし、**ウェブアプリのURL**をコピー

> **重要**: `gas-code.js`には学習履歴の保存、問題データの読み込み、コースデータの読み込みの3つの機能が含まれています。

### 4. プロジェクトの設定

1. このリポジトリをクローンまたはダウンロード
2. `config.js`ファイルを開く
3. 以下の値を設定:

```javascript
const CONFIG = {
  // Google OAuth Client ID
  GOOGLE_CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  
  // Google Apps Script Web App URL
  SHEETS_API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  
  // 教員メールアドレス（管理パネルにアクセス可能）
  TEACHER_EMAILS: [
    'teacher1@example.com',
    'teacher2@example.com'
  ],
  
  // 学生ドメイン制限（このドメインのメールアドレスのみログイン可能）
  ALLOWED_STUDENT_DOMAIN: 'students.example.com',
  
  // その他の設定...
};
```

---

## 🎨 カスタマイズガイド

### 5.1 基本設定（UI文言・リンク）

#### 5.1.1 アプリケーション名の変更

**変更箇所1: `config.js`**
```javascript
APP_NAME: 'あなたのアプリケーション名'
```

**変更箇所2: `index.html`（7行目）**
```html
<title>あなたのアプリケーション名</title>
```

**変更箇所3: `index.html`（49行目）**
```html
<h1>🐍 あなたの<br>アプリケーション名</h1>
```

#### 5.1.2 ログイン画面の文言変更

**`index.html` 49-54行目付近:**

```html
<h1>🐍 Python学習<br>プラットフォーム</h1>
<p>Pythonの基礎を楽しく学びましょう！</p>
<p style="font-size: 0.95rem; color: var(--text-muted);">
    Gmailアカウントでログインして学習を始めてください
</p>
```

これらのテキストを自由に変更できます。

#### 5.1.3 ホーム画面のロゴ文言（ヘッダー）

**`index.html` 25行目:**

```html
<div class="logo" onclick="returnToHome()">🐍 Python学習</div>
```

絵文字とテキストを変更することで、ブランディングをカスタマイズできます。

#### 5.1.4 外部リンクの設定

**`index.html` 62-67行目:**

```html
<div class="external-link-section">
    <a href="https://example.com/your-link" target="_blank"
        class="external-link-btn">
        <span class="external-link-icon">🔗</span>
        あなたのリンクテキスト
    </a>
</div>
```

**リンクを非表示にする場合:**

```html
<div class="external-link-section" style="display: none;">
    <!-- ... -->
</div>
```

または、セクション全体を削除してください。

#### 5.1.5 注意事項の編集

**`index.html` 127-133行目付近:**

```html
<ul style="text-align: left; margin-left: 2rem; margin-top: 0.5rem;">
    <li>問題はあなた専用の順序で表示されます（再現性あり）</li>
    <li>正解すると確認コードが表示されます</li>
    <li>統計は「終了」ボタンを押した後に集計されます</li>
    <li>途中で終了しても、次回は続きから始められます</li>
    <li><strong>別のコースに切り替える場合は「リセット」ボタンを押してください</strong></li>
    <li>⚠️ リセットまたはログアウトすると、すべてのコースの進捗が削除されます</li>
</ul>
```

必要に応じて項目を追加・削除・変更できます。

### 5.2 アクセス制御のカスタマイズ

#### 5.2.1 教員メールアドレスの設定

管理パネルにアクセスできるメールアドレスを設定します。

**`config.js`:**

```javascript
TEACHER_EMAILS: [
    'teacher1@example.com',
    'teacher2@example.com',
    'admin@example.com'
]
```

#### 5.2.2 学生ドメイン制限の設定

特定のドメインのメールアドレスのみログインを許可します。

**`config.js`:**

```javascript
ALLOWED_STUDENT_DOMAIN: 'students.example.com'
```

例: `user@students.example.com` はログイン可能、`user@gmail.com` はログイン不可

#### 5.2.3 ドメイン制限の無効化

すべてのGmailアカウントでログインを許可する場合：

**`app.js` 79-87行目をコメントアウト:**

```javascript
// ドメインチェックを無効化
/*
if (!email.endsWith(`@${CONFIG.ALLOWED_STUDENT_DOMAIN}`) && 
    !CONFIG.TEACHER_EMAILS.includes(email)) {
    showToast(`アクセスが許可されていません。${CONFIG.ALLOWED_STUDENT_DOMAIN} のメールアドレスでログインしてください。`, 'error');
    google.accounts.id.revoke(email);
    return;
}
*/
```

### 5.3 コース管理

#### 5.3.1 管理パネルからコースを追加

1. ログイン後、「管理」ボタンをクリック
2. 「コース追加」タブを選択
3. 以下の情報を入力:
   - コースID（例: `python-basics`）
   - コース名（例: `Python基礎`）
   - 説明（例: `Pythonの基本文法を学ぶ`）
   - アイコン（絵文字、例: `🐍`）
4. 「追加」ボタンをクリック

#### 5.3.2 Google Sheetsからコースを読み込む

Google Sheetsの「コースデータ」シートに以下の形式でデータを入力:

| ID | Title | Description | Icon |
|----|-------|-------------|------|
| python-basics | Python基礎 | Pythonの基本文法を学ぶ | 🐍 |
| python-advanced | Python応用 | より高度なPythonの概念を学ぶ | 🚀 |

Google Apps Scriptが自動的にデータを読み込みます。

### 5.4 問題管理

#### 5.4.1 管理パネルから問題を追加

1. 「管理」ボタンをクリック
2. 「問題追加」タブを選択
3. 以下の情報を入力:
   - コースID
   - 問題タイプ（単一選択、複数選択、記述）
   - 問題文
   - 選択肢（選択問題の場合）
   - 正解
   - 解説（オプション）
4. 「追加」ボタンをクリック

#### 5.4.2 Google Sheetsから問題を読み込む

Google Sheetsの「問題データ」シートに以下の形式でデータを入力:

| ID | CourseID | Type | Question | Options | Answer | Explanation |
|----|----------|------|----------|---------|--------|-------------|
| py-001 | python-basics | single | Pythonの拡張子は？ | ["`.py`","`.python`","`.pt`"] | `.py` | Pythonファイルの拡張子は.pyです |

**Options列の形式**: JSON配列形式で入力（`["選択肢1","選択肢2","選択肢3"]`）

**Type列の値**:
- `single`: 単一選択
- `multiple`: 複数選択
- `text`: 記述式

### 5.5 UI設定

#### 5.5.1 タイマー表示の設定

**`config.js`:**

```javascript
UI_SETTINGS: {
    SHOW_TIMER: true,  // false にすると経過時間を非表示
    AUTO_SCROLL: true  // false にすると自動スクロールを無効化
}
```

#### 5.5.2 解説表示の設定

**`config.js`:**

```javascript
QUESTION_SETTINGS: {
    SHOW_EXPLANATIONS: true  // false にすると解説を非表示
}
```

---

## 🚀 デプロイ

### ローカルでのテスト

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

### GitHub Pagesへのデプロイ

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

---

## 📖 使い方

1. **ログイン**: Gmailアカウントでログイン
2. **コース選択**: 学習したいコースをクリック
3. **学習開始**: 「スタート」ボタンをクリック
4. **問題回答**: 
   - 問題を読んで回答を選択/入力
   - 「回答する」ボタンをクリック
   - 正解の場合、確認コードが表示されます（コピー可能）
   - 「次の問題へ」で次に進む
5. **コース切り替え**: 別のコースに切り替える場合は「リセット」ボタンを押してください
6. **終了**: 「終了」ボタンでセッションを終了し、データを保存

⚠️ **注意**: リセットまたはログアウトすると、すべてのコースの進捗が削除されます。

---

## 🔧 トラブルシューティング

### ログインできない

- Google Cloud ConsoleでOAuth認証情報が正しく設定されているか確認
- 承認済みのJavaScript生成元に現在のURLが含まれているか確認
- ブラウザのコンソール（F12）でエラーメッセージを確認

### データが保存されない

- Google Apps ScriptのウェブアプリURLが正しく設定されているか確認
- Apps Scriptのデプロイ設定で「アクセスできるユーザー: 全員」になっているか確認
- ブラウザのコンソールでネットワークエラーを確認
- Google Sheetsの共有設定を確認

### 問題が表示されない

- Google Sheetsの「問題データ」シートにデータが正しく入力されているか確認
- ブラウザのコンソールでJavaScriptエラーを確認
- Google Apps Scriptが正しくデプロイされているか確認

### コース一覧が表示されない

- Google Sheetsの「コースデータ」シートにデータが正しく入力されているか確認
- 管理パネルから手動でコースを追加してみる
- ブラウザのキャッシュをクリアしてリロード（Ctrl+Shift+R）

### 管理パネルにアクセスできない

- `config.js`の`TEACHER_EMAILS`に自分のメールアドレスが含まれているか確認
- 正しいGoogleアカウントでログインしているか確認

---

## 📊 技術仕様

### データ構造

#### Google Sheetsに保存される学習履歴

| 列名 | 説明 | 例 |
|------|------|-----|
| Timestamp | セッション終了時刻 | 2025-11-27T12:30:00.000Z |
| Email | ユーザーのメールアドレス | user@example.com |
| Name | ユーザー名 | 山田太郎 |
| CourseID | コースID | python-intro |
| Questions Answered | 回答した問題数 | 20 |
| Total Errors | 合計誤答数 | 5 |
| Elapsed Time (seconds) | 経過時間（秒） | 900 |
| Start Time | セッション開始時刻 | 1732694400000 |
| End Time | セッション終了時刻 | 1732695300000 |

#### 問題データの構造

```javascript
{
  id: 'py-001',              // ユニークなID
  course: 'python-intro',    // コースID
  type: 'single',            // 'single', 'multiple', 'text'
  question: '問題文',
  options: ['選択肢1', '選択肢2', '選択肢3'],  // single/multipleの場合
  answer: '正解',            // または ['正解1', '正解2'] (multiple)
  explanation: '解説'        // オプション
}
```

### セキュリティ

- OAuth Client IDは公開されても問題ありませんが、Client Secretは**絶対に公開しないでください**
- このプロジェクトではClient Secretを使用しない公開フローを使用しています
- Google Apps Scriptをプロキシとして使用することで、Sheets APIの認証情報を保護しています
- ドメイン制限により、特定のメールアドレスのみアクセス可能

### 使用技術

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **認証**: Google Identity Services (OAuth 2.0)
- **データ保存**: Google Sheets API (via Google Apps Script)
- **デプロイ**: 静的ホスティング（GitHub Pages等）

---

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📧 サポート

問題が発生した場合は、GitHubのIssuesで報告してください。

---

## 🎓 教育機関での利用について

このプラットフォームは教育機関での利用を想定して設計されています：

- **ドメイン制限**: 学校のメールドメインのみアクセス可能
- **進捗管理**: 学生の学習状況をGoogle Sheetsで一元管理
- **カスタマイズ性**: 科目や内容に応じて柔軟に変更可能
- **無料**: Google Cloudの無料枠内で運用可能

ご不明な点がございましたら、お気軽にお問い合わせください。
