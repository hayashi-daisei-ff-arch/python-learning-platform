# 実装状況と残りのタスク

## ✅ 完了した作業

### 1. データ保存の修正
- `sheets-api.js`を更新し、Google Apps ScriptのCORS問題を解決
- `no-cors`モードを使用するように変更
- フォールバックメソッドを追加

### 2. 管理パネルの作成
- `admin.js`を新規作成
- 以下の機能を実装:
  - 問題の追加・編集・削除
  - コースの追加・編集・削除
  - localStorageへの永続化
  - 動的なコースカード読み込み

## ⚠️ 残りのタスク

### 1. CSSファイルの修正
`styles.css`ファイルが重複コンテンツで破損しています。以下の手順で修正してください:

1. `styles.css`ファイルを開く
2. 790行目以降の重複部分を削除
3. 以下のコードを790行目以降に追加:

```css
}

/* Loading Animation */
@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.loading {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Progress Bar */
.progress-bar-container {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    height: 12px;
    overflow: hidden;
    margin: var(--spacing-md) 0;
    position: relative;
}

.progress-bar {
    height: 100%;
    background: var(--gradient-primary);
    border-radius: var(--radius-lg);
    transition: width 0.5s ease;
    position: relative;
    overflow: hidden;
}

.progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

.progress-text {
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-top: var(--spacing-xs);
}

/* External Link Button */
.external-link-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 600;
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);
    margin: var(--spacing-md);
}

.external-link-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.external-link-icon {
    font-size: 1.2rem;
}

/* Admin Panel - 以下、admin.jsで作成した管理パネル用のスタイル */
#admin-section {
    display: none;
    padding: var(--spacing-xl) 0;
}

.admin-panel {
    background: var(--bg-glass);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-lg);
}

.admin-panel h2 {
    font-size: 2rem;
    margin-bottom: var(--spacing-lg);
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.admin-tabs {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.admin-tab {
    padding: var(--spacing-md) var(--spacing-lg);
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    border-bottom: 3px solid transparent;
    font-size: 1.1rem;
    font-weight: 600;
}

.admin-tab.active {
    color: var(--accent-primary);
    border-bottom-color: var(--accent-primary);
}

.admin-tab:hover {
    color: var(--text-primary);
}

.admin-tab-content {
    display: none;
}

.admin-tab-content.active {
    display: block;
}

.form-group {
    margin-bottom: var(--spacing-lg);
}

.form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
    font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: var(--spacing-md);
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 1rem;
    font-family: inherit;
    transition: all var(--transition-fast);
}

.form-group textarea {
    min-height: 100px;
    resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--accent-primary);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.form-group small {
    display: block;
    margin-top: var(--spacing-xs);
    color: var(--text-muted);
    font-size: 0.85rem;
}

.option-input-group {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
}

.option-input-group input {
    flex: 1;
}

.option-input-group button {
    padding: var(--spacing-sm);
    background: var(--accent-error);
    border: none;
    border-radius: var(--radius-sm);
    color: white;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.option-input-group button:hover {
    background: #dc2626;
}

.add-option-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--accent-success);
    border: none;
    border-radius: var(--radius-sm);
    color: white;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-weight: 600;
}

.add-option-btn:hover {
    background: #059669;
}

.admin-btn-group {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
}

.btn-admin {
    flex: 1;
    padding: var(--spacing-md);
    border: none;
    border-radius: var(--radius-md);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.btn-save {
    background: var(--gradient-success);
    color: white;
}

.btn-save:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.btn-cancel {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
}

.btn-cancel:hover {
    background: rgba(255, 255, 255, 0.15);
}

.admin-btn {
    margin-left: var(--spacing-sm);
    padding: var(--spacing-xs) var(--spacing-md);
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    border: none;
    color: white;
    border-radius: var(--spacing-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 0.9rem;
    font-weight: 600;
}

.admin-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.question-list {
    max-height: 400px;
    overflow-y: auto;
    margin-top: var(--spacing-md);
}

.question-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.question-item:hover {
    background: rgba(255, 255, 255, 0.08);
}

.question-item-info {
    flex: 1;
}

.question-item-id {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-family: 'Courier New', monospace;
}

.question-item-text {
    margin-top: var(--spacing-xs);
    color: var(--text-primary);
}

.question-item-actions {
    display: flex;
    gap: var(--spacing-sm);
}

.btn-edit,
.btn-delete {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 0.9rem;
}

.btn-edit {
    background: var(--accent-info);
    color: white;
}

.btn-edit:hover {
    background: #2563eb;
}

.btn-delete {
    background: var(--accent-error);
    color: white;
}

.btn-delete:hover {
    background: #dc2626;
}
```

### 2. HTMLファイルの更新

`index.html`に以下を追加してください:

#### ヘッダーに管理ボタンを追加 (ログアウトボタンの後):
```html
<button class="admin-btn" onclick="toggleAdminPanel()">管理</button>
```

#### コース選択セクションの前に外部リンクボタンを追加:
```html
<div style="text-align: center; margin: 2rem 0;">
  <a href="https://hayashi-daisei-ff-arch.github.io/python_learning_site/" 
     target="_blank" 
     class="external-link-btn">
    <span class="external-link-icon">🔗</span>
    初心者用Python学習サイトへ
  </a>
</div>
```

#### 問題ヘッダーにプログレスバーを追加 (question-headerの後):
```html
<div class="progress-bar-container">
  <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
</div>
<div class="progress-text" id="progress-text">0 / 20 問完了</div>
```

#### 管理パネルセクションを追加 (quiz-sectionの後):
```html
<section id="admin-section" class="container">
  <div class="admin-panel">
    <h2>管理パネル</h2>
    
    <div class="admin-tabs">
      <button class="admin-tab active" onclick="switchAdminTab('questions')">問題一覧</button>
      <button class="admin-tab" onclick="switchAdminTab('add-question')">問題追加</button>
      <button class="admin-tab" onclick="switchAdminTab('courses')">コース一覧</button>
      <button class="admin-tab" onclick="switchAdminTab('add-course')">コース追加</button>
    </div>
    
    <!-- 問題一覧タブ -->
    <div id="questions-tab" class="admin-tab-content active">
      <h3>登録済み問題</h3>
      <div id="questions-list" class="question-list"></div>
    </div>
    
    <!-- 問題追加タブ -->
    <div id="add-question-tab" class="admin-tab-content">
      <h3>新しい問題を追加</h3>
      <div class="form-group">
        <label>コースID</label>
        <select id="question-course">
          <option value="">選択してください</option>
          <option value="python-intro">python-intro</option>
        </select>
      </div>
      <div class="form-group">
        <label>問題タイプ</label>
        <select id="question-type">
          <option value="single">単一選択</option>
          <option value="multiple">複数選択</option>
          <option value="text">記述</option>
        </select>
      </div>
      <div class="form-group">
        <label>問題文</label>
        <textarea id="question-text-input" placeholder="問題文を入力"></textarea>
      </div>
      <div class="form-group" id="options-group">
        <label>選択肢</label>
        <div id="options-container"></div>
        <button class="add-option-btn" onclick="addOptionInput()">選択肢を追加</button>
      </div>
      <div class="form-group">
        <label>正解</label>
        <input type="text" id="question-answer" placeholder="正解を入力（複数選択の場合はカンマ区切り）">
        <small>複数選択の場合: 選択肢1, 選択肢2</small>
      </div>
      <div class="form-group">
        <label>解説（オプション）</label>
        <textarea id="question-explanation" placeholder="解説を入力"></textarea>
      </div>
      <div class="admin-btn-group">
        <button class="btn-admin btn-save" onclick="addNewQuestion()">追加</button>
        <button class="btn-admin btn-cancel" onclick="clearQuestionForm()">クリア</button>
      </div>
    </div>
    
    <!-- コース一覧タブ -->
    <div id="courses-tab" class="admin-tab-content">
      <h3>登録済みコース</h3>
      <div id="courses-list" class="question-list"></div>
    </div>
    
    <!-- コース追加タブ -->
    <div id="add-course-tab" class="admin-tab-content">
      <h3>新しいコースを追加</h3>
      <div class="form-group">
        <label>コースID</label>
        <input type="text" id="course-id" placeholder="例: python-advanced">
        <small>英数字とハイフンのみ使用可能</small>
      </div>
      <div class="form-group">
        <label>コースタイトル</label>
        <input type="text" id="course-title" placeholder="例: Python応用">
      </div>
      <div class="form-group">
        <label>説明</label>
        <textarea id="course-description" placeholder="コースの説明を入力"></textarea>
      </div>
      <div class="form-group">
        <label>アイコン（絵文字）</label>
        <input type="text" id="course-icon" placeholder="例: 🚀">
      </div>
      <div class="admin-btn-group">
        <button class="btn-admin btn-save" onclick="addNewCourse()">追加</button>
        <button class="btn-admin btn-cancel" onclick="clearCourseForm()">クリア</button>
      </div>
    </div>
  </div>
</section>
```

#### スクリプトタグに admin.js を追加:
```html
<script src="admin.js"></script>
```

### 3. app.jsの更新

`showQuestion`関数内にプログレスバー更新コードを追加:

```javascript
// Update progress bar
const progress = ((index + 1) / currentQuestions.length) * 100;
document.getElementById('progress-bar').style.width = progress + '%';
document.getElementById('progress-text').textContent = 
  `${index + 1} / ${currentQuestions.length} 問完了`;
```

## 📝 注意事項

1. CSSファイルの修正が最優先です（現在エラーが発生しています）
2. 管理パネルはlocalStorageを使用しているため、ブラウザのデータをクリアすると追加したデータが消えます
3. 本番環境では、localStorageではなくGoogle Sheetsなどのバックエンドストレージを使用することを推奨します

## 🔧 テスト手順

1. CSSファイルを修正
2. HTMLファイルを更新
3. app.jsを更新
4. ブラウザでページを開く
5. ログイン後、「管理」ボタンをクリック
6. 問題やコースを追加してテスト
7. プログレスバーが正しく表示されることを確認
8. 外部リンクボタンが機能することを確認
