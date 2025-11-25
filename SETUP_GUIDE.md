# 📚 詳細セットアップガイド

このガイドでは、Python学習プラットフォームを初めてセットアップする方のために、ステップバイステップで詳しく説明します。

## 目次

1. [Google Cloud Projectの作成](#1-google-cloud-projectの作成)
2. [OAuth 2.0認証情報の設定](#2-oauth-20認証情報の設定)
3. [Google Sheets APIの有効化](#3-google-sheets-apiの有効化)
4. [Google Sheetsの準備](#4-google-sheetsの準備)
5. [Google Apps Scriptの設定](#5-google-apps-scriptの設定)
6. [プロジェクトファイルの設定](#6-プロジェクトファイルの設定)
7. [ローカルテスト](#7-ローカルテスト)
8. [GitHub Pagesへのデプロイ](#8-github-pagesへのデプロイ)

---

## 1. Google Cloud Projectの作成

### 手順

1. **Google Cloud Consoleにアクセス**
   - ブラウザで https://console.cloud.google.com/ を開く
   - Googleアカウントでログイン

2. **新しいプロジェクトを作成**
   - 画面上部の「プロジェクトを選択」をクリック
   - 「新しいプロジェクト」をクリック
   - プロジェクト名を入力（例: `python-learning-platform`）
   - 「作成」をクリック

3. **プロジェクトを選択**
   - 作成したプロジェクトが自動的に選択されます
   - 選択されていない場合は、画面上部から選択してください

---

## 2. OAuth 2.0認証情報の設定

### 手順

1. **OAuth同意画面の設定**
   - 左側メニューから「APIとサービス」→「OAuth同意画面」を選択
   - User Type: **外部**を選択（個人用の場合）
   - 「作成」をクリック
   
2. **アプリ情報の入力**
   - アプリ名: `Python学習プラットフォーム`
   - ユーザーサポートメール: あなたのメールアドレス
   - デベロッパーの連絡先情報: あなたのメールアドレス
   - 「保存して次へ」をクリック

3. **スコープの設定**
   - デフォルトのまま「保存して次へ」をクリック

4. **テストユーザーの追加（オプション）**
   - 開発中は特定のユーザーのみアクセス可能にできます
   - 「保存して次へ」をクリック

5. **OAuth クライアント IDの作成**
   - 左側メニューから「認証情報」を選択
   - 「認証情報を作成」→「OAuth クライアント ID」をクリック
   
6. **アプリケーションの種類を選択**
   - アプリケーションの種類: **ウェブアプリケーション**
   - 名前: `Python学習プラットフォーム Web Client`

7. **承認済みのJavaScript生成元を追加**
   - 「URIを追加」をクリック
   - ローカルテスト用: `http://localhost:8000`
   - （後でGitHub Pages用のURLも追加します）

8. **承認済みのリダイレクトURIは空のまま**
   - Google Sign-Inでは不要です

9. **作成**
   - 「作成」をクリック
   - **クライアントID**が表示されます
   - 📋 このIDをコピーして安全な場所に保存してください
   - 形式: `XXXXXXXXXX.apps.googleusercontent.com`

---

## 3. Google Sheets APIの有効化

### 手順

1. **APIライブラリにアクセス**
   - 左側メニューから「APIとサービス」→「ライブラリ」を選択

2. **Google Sheets APIを検索**
   - 検索ボックスに「Google Sheets API」と入力
   - 検索結果から「Google Sheets API」をクリック

3. **APIを有効化**
   - 「有効にする」ボタンをクリック
   - 有効化には数秒かかります

---

## 4. Google Sheetsの準備

### 手順

1. **新しいスプレッドシートを作成**
   - https://sheets.google.com/ にアクセス
   - 「空白」をクリックして新しいスプレッドシートを作成

2. **スプレッドシートに名前を付ける**
   - 左上の「無題のスプレッドシート」をクリック
   - 名前を入力（例: `Python学習データ`）

3. **列見出しを設定**
   - A1セルから以下の列名を入力:
     - A1: `Timestamp`
     - B1: `Email`
     - C1: `Name`
     - D1: `Course`
     - E1: `Questions Answered`
     - F1: `Total Errors`
     - G1: `Average Time (seconds)`
     - H1: `Session Duration (minutes)`

4. **書式設定（オプション）**
   - 1行目を選択して太字にする
   - 背景色を設定する
   - 列幅を調整する

5. **スプレッドシートIDをメモ**
   - URLから取得: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - `SPREADSHEET_ID`の部分をコピー（後で使用します）

---

## 5. Google Apps Scriptの設定

### なぜGoogle Apps Scriptを使うのか？

クライアントサイドのJavaScriptから直接Google Sheets APIを呼び出すと、APIキーやアクセストークンがブラウザに露出してしまいます。Google Apps Scriptをバックエンドプロキシとして使用することで、認証情報を安全に保護できます。

### 手順

1. **Apps Scriptエディタを開く**
   - Google Sheetsで「拡張機能」→「Apps Script」をクリック
   - 新しいタブでApps Scriptエディタが開きます

2. **コードを貼り付け**
   - デフォルトの`function myFunction() {}`を削除
   - 以下のコードを貼り付け:

```javascript
function doPost(e) {
  try {
    // スプレッドシートを取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // POSTデータをパース
    const data = JSON.parse(e.postData.contents);
    
    // データを追加
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
    
    // 成功レスポンスを返す
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // エラーレスポンスを返す
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// テスト用関数（オプション）
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        email: 'test@example.com',
        name: 'テストユーザー',
        course: 'python-intro',
        questionsAnswered: 10,
        totalErrors: 2,
        averageTime: 30.5,
        sessionDuration: 5
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
```

3. **プロジェクトに名前を付ける**
   - 「無題のプロジェクト」をクリック
   - 名前を入力（例: `Python学習データAPI`）
   - 「名前を変更」をクリック

4. **保存**
   - Ctrl+S（Windows）またはCmd+S（Mac）で保存
   - またはディスクアイコンをクリック

5. **デプロイ**
   - 「デプロイ」→「新しいデプロイ」をクリック
   - 「種類の選択」（歯車アイコン）→「ウェブアプリ」を選択
   
6. **デプロイ設定**
   - 説明: `v1`（バージョン管理用）
   - 次のユーザーとして実行: **自分**
   - アクセスできるユーザー: **全員**
   - 「デプロイ」をクリック

7. **アクセスを承認**
   - 「アクセスを承認」をクリック
   - Googleアカウントを選択
   - 「詳細」→「Python学習データAPI（安全ではないページ）に移動」をクリック
   - 「許可」をクリック

8. **ウェブアプリのURLをコピー**
   - デプロイ完了後、**ウェブアプリのURL**が表示されます
   - 📋 このURLをコピーして安全な場所に保存してください
   - 形式: `https://script.google.com/macros/s/SCRIPT_ID/exec`

9. **テスト（オプション）**
   - Apps Scriptエディタで`testDoPost`関数を選択
   - 「実行」をクリック
   - Google Sheetsに新しい行が追加されることを確認

---

## 6. プロジェクトファイルの設定

### 手順

1. **config.jsを開く**
   - テキストエディタで`config.js`を開く

2. **設定値を更新**
   - `GOOGLE_CLIENT_ID`: 手順2でコピーしたOAuth Client ID
   - `SHEETS_API_URL`: 手順5でコピーしたGoogle Apps ScriptのウェブアプリURL

```javascript
const CONFIG = {
  GOOGLE_CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // ← ここを更新
  SHEETS_API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', // ← ここを更新
  // ...
};
```

3. **保存**
   - ファイルを保存

---

## 7. ローカルテスト

### 手順

1. **HTTPサーバーを起動**

   **Python 3を使用する場合:**
   ```bash
   cd python-learning-platform
   python -m http.server 8000
   ```

   **Node.jsを使用する場合:**
   ```bash
   npx http-server -p 8000
   ```

   **VS Code Live Serverを使用する場合:**
   - VS Codeで`index.html`を開く
   - 右クリック→「Open with Live Server」

2. **ブラウザでアクセス**
   - http://localhost:8000 を開く

3. **動作確認**
   - ✅ ログイン画面が表示される
   - ✅ Gmailでログインできる
   - ✅ コース選択画面が表示される
   - ✅ 問題が表示される
   - ✅ 回答できる
   - ✅ 正解時に確認コードが表示される
   - ✅ 終了時にGoogle Sheetsにデータが保存される

4. **トラブルシューティング**
   - ログインできない場合:
     - ブラウザのコンソール（F12）でエラーを確認
     - OAuth Client IDが正しいか確認
     - 承認済みのJavaScript生成元に`http://localhost:8000`が含まれているか確認
   
   - データが保存されない場合:
     - Google Apps ScriptのURLが正しいか確認
     - Apps Scriptのデプロイ設定を確認
     - ブラウザのコンソールでネットワークエラーを確認

---

## 8. GitHub Pagesへのデプロイ

### 手順

1. **GitHubリポジトリを作成**
   - https://github.com/new にアクセス
   - リポジトリ名を入力（例: `python-learning-platform`）
   - Public または Private を選択
   - 「Create repository」をクリック

2. **ローカルリポジトリを初期化**
   ```bash
   cd python-learning-platform
   git init
   git add .
   git commit -m "Initial commit: Python learning platform"
   ```

3. **リモートリポジトリを追加**
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

4. **GitHub Pagesを有効化**
   - GitHubリポジトリページで「Settings」タブをクリック
   - 左側メニューから「Pages」を選択
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**
   - 「Save」をクリック

5. **デプロイを待つ**
   - 数分後、緑色のチェックマークが表示されます
   - URLが表示されます: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

6. **OAuth認証情報を更新**
   - Google Cloud Consoleに戻る
   - 「APIとサービス」→「認証情報」
   - 作成したOAuth クライアント IDをクリック
   - 「承認済みのJavaScript生成元」に以下を追加:
     - `https://YOUR_USERNAME.github.io`
   - 「保存」をクリック

7. **動作確認**
   - GitHub PagesのURLにアクセス
   - すべての機能が正常に動作することを確認

---

## 🎉 完了！

セットアップが完了しました！これで学習プラットフォームを使用できます。

### 次のステップ

- 問題を追加する（`questions.js`を編集）
- 新しいコースを追加する
- UIをカスタマイズする
- 学生にURLを共有する

### サポート

問題が発生した場合は、以下を確認してください:
- ブラウザのコンソール（F12）でエラーメッセージを確認
- `README.md`のトラブルシューティングセクションを参照
- GitHubのIssuesで質問する
