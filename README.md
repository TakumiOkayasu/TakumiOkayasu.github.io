# Takumi Okayasu - ポートフォリオサイト

> React 19、TypeScript、Tailwind CSS で構築されたモダンでレスポンシブなポートフォリオサイト

🌐 **ライブデモ**: [takumiokayasu.github.io](https://takumiokayasu.github.io)

## ✨ 機能

- 🎨 **モダンなデザイン** - スムーズなアニメーション付きのクリーンで専門的なUI
- 🌙 **ダークモード** - システムテーマの自動検出 + 手動切り替え
- 📱 **完全レスポンシブ** - モバイル、タブレット、デスクトップに最適化
- ⚡ **高パフォーマンス** - Vite と React 19 で最適な速度を実現
- 🔧 **データ駆動型** - JSON設定による簡単なコンテンツ更新
- ♿ **アクセシビリティ** - WCAG準拠、適切なARIAラベル
- 🎯 **TypeScript** - コードベース全体での完全な型安全性

## 🛠️ 技術スタック

### フロントエンド
- **React 19.1.0** - 並行機能を含む最新のReact
- **TypeScript 5.8.3** - 静的型チェック
- **Tailwind CSS 4.1.11** - ユーティリティファーストCSSフレームワーク
- **Vite 7.0.5** - 次世代フロントエンドツール

### 開発ツール
- **Bun** - 高速JavaScriptランタイム＆パッケージマネージャー
- **Biome 2.1.2** - 高速リンター＆フォーマッター
- **SWC** - 超高速TypeScript/JavaScriptコンパイラー
- **Vitest** - ユニットテストフレームワーク
- **Cypress** - エンドツーエンドテスト

### インフラストラクチャ
- **GitHub Pages** - 静的サイトホスティング
- **Docker Dev Container** - 一貫した開発環境

## 🏗️ プロジェクト構造

```text
src/
├── components/           # Reactコンポーネント
│   ├── AboutSection.tsx     # 自己紹介セクション
│   ├── ContactSection.tsx   # 連絡先情報
│   ├── DarkModeToggle.tsx   # テーマスイッチャー
│   ├── ExperienceSection.tsx# 職歴タイムライン
│   ├── Header.tsx           # サイトヘッダー
│   ├── HeroSection.tsx      # ヒーロー/イントロセクション
│   ├── Icons.tsx            # SVGアイコンコンポーネント
│   ├── Portfolio.tsx        # メインポートフォリオコンテナ
│   ├── ProjectsSection.tsx  # プロジェクトショーケース
│   └── SkillsSection.tsx    # スキルと技術
├── contexts/            # Reactコンテキスト
│   └── ThemeContext.tsx     # ダークモード状態管理
├── hooks/               # カスタムReactフック
│   └── useTheme.ts          # テーマ切り替えロジック
├── types/               # TypeScript定義
│   └── types.ts             # データ構造インターフェース
├── App.tsx              # ルートアプリケーションコンポーネント
└── main.tsx             # アプリケーションエントリーポイント

public/
├── data/                # コンテンツ設定
│   ├── contact.json         # 連絡先情報
│   ├── experiences.json     # 職歴データ
│   ├── personal.json        # 個人プロフィールデータ
│   ├── projects.json        # ポートフォリオプロジェクト
│   └── skills.json          # 技術スキル
└── *.svg                # アイコンとアセット
```

## 🚀 始め方

### 前提条件
- **Bun**（推奨）または Node.js 18+
- モダンなWebブラウザ

### インストール

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/takumiokayasu/takumiokayasu.github.io.git
   cd takumiokayasu.github.io
   ```

2. **依存関係のインストール**
   ```bash
   # Bunを使用（推奨）
   bun install
   ```

3. **開発サーバーの起動**
   ```bash
   # Bunを使用
   bun run dev
   ```

4. **ブラウザで確認**
   `http://localhost:5173` にアクセス

## 📋 利用可能なスクリプト

| スクリプト | 説明 |
|-----------|-----|
| `bun run dev` | 開発サーバーの起動 |
| `bun run build` | プロダクションビルド |
| `bun run preview` | プロダクションビルドのプレビュー |
| `bun run lint` | Biomeリンターの実行 |
| `bun run format` | Biomeでコードフォーマット |
| `bun run test` | ユニットテストの実行 |
| `bun run test:e2e` | エンドツーエンドテストの実行 |
| `bun run type-check` | TypeScript型チェック |

## 🎨 カスタマイズ

### コンテンツの更新

すべてのコンテンツは `public/data/` ディレクトリのJSONファイルに保存されています：

- **personal.json** - プロフィール情報、経歴、アバター
- **skills.json** - カテゴリ別の技術スキル
- **experiences.json** - 職歴と学歴
- **projects.json** - ポートフォリオプロジェクトとリンク
- **contact.json** - 連絡先情報とソーシャルリンク

### テーマのカスタマイズ

色とスタイリングは以下でカスタマイズできます：
- `tailwind.config.js` - カラーパレットとスペーシング
- `src/App.css` - グローバルスタイルとテーマ変数

### 新しいセクションの追加

1. `src/components/` に新しいコンポーネントを作成
2. `Portfolio.tsx` にコンポーネントを追加
3. `src/types/types.ts` にTypeScriptインターフェースを定義
4. 必要に応じて対応するJSONデータを追加

## 🌙 ダークモード実装

ダークモードシステムには以下が含まれます：
- **システム検出** - ユーザーのOSテーマ設定を自動検出
- **手動オーバーライド** - 手動テーマ切り替え用のトグルボタン
- **永続ストレージ** - セッション間でのユーザー設定の記憶
- **スムーズな遷移** - テーマ間の300msアニメーション

### 技術的詳細
- Tailwindの `dark:` プレフィックスを使用した条件付きスタイリング
- グローバルテーマ状態管理にContext API使用
- `<html>` 要素にCSSクラスを適用
- 設定の永続化に `localStorage` を使用

## 📱 レスポンシブデザイン

サイトはすべての画面サイズに最適化されています：
- **モバイル** - < 768px（コンパクトレイアウト、タッチ対応）
- **タブレット** - 768px - 1024px（適応的スペーシング）
- **デスクトップ** - > 1024px（サイドバー付きフルレイアウト）

主なレスポンシブ機能：
- CSS GridとFlexboxを使用した柔軟なグリッドレイアウト
- 適応的タイポグラフィースケーリング
- タッチ最適化されたインタラクティブ要素
- 最適化された画像とアイコン

## 🧪 テスト

### ユニットテスト
```bash
bun run test        # 全ユニットテストの実行
bun run test:watch  # 開発用ウォッチモード
```

### E2Eテスト
```bash
bun run test:e2e    # Cypressテストの実行
```

### テストカバレッジ
- コンポーネントはReact Testing Libraryでテスト
- カスタムフックは専用テストユーティリティでテスト
- テーマ切り替えとデータ読み込みの統合テスト

## 🚀 デプロイメント

### GitHub Pages（自動）
このサイトは `main` ブランチへのプッシュごとにGitHub Pagesに自動デプロイされます。

## 🔧 パフォーマンス最適化

- **コード分割** - Viteによる自動実行
- **アセット最適化** - SVGアイコン、最適化された画像
- **バンドル分析** - Lighthouse CI統合
- **並行機能** - React 19並行レンダリング
- **高速リフレッシュ** - 開発時のサブ秒ホットリロード

## 📊 ブラウザサポート

- **モダンブラウザ** - Chrome、Firefox、Safari、Edge（直近2バージョン）
- **モバイルブラウザ** - iOS Safari、Chrome Mobile
- **プログレッシブエンハンスメント** - 古いブラウザでの優雅な劣化

## 🤝 貢献

1. リポジトリをフォーク
2. 機能ブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. プルリクエストを開く

### 開発ガイドライン
- TypeScriptベストプラクティスに従う
- リントとフォーマットにBiomeを使用
- 新しいコンポーネントのテストを記述
- 必要に応じてドキュメントを更新

