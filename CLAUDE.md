# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリは `takumiokayasu.github.io` のGitHub PagesプロジェクトでReact + TypeScript + Viteを使用したSPAベースのポートフォリオサイトです。現在は開発段階にあり、デモ用のHTMLファイルとスキルデータのJSONファイルが含まれています。

## 開発環境

### Dev Container
このプロジェクトは`.devcontainer`を使用した開発環境が構築されています:
- **ランタイム**: Bun (高速JavaScriptランタイム)
- **フレームワーク**: React 19.1.0 + TypeScript
- **ビルドツール**: Vite 7.0.4
- **リントツール**: ESLint 9.30.1 + TypeScript ESLint
- **コードフォーマッター**: Biome (VS Code拡張機能)
- **プラグイン**: @vitejs/plugin-react-swc (高速リフレッシュ)

### 開発環境の起動
```bash
# VS CodeでDev Containerを起動
# 「Reopen in Container」を実行
```

## プロジェクト構造

```
/
├── .devcontainer/     # Dev Container設定
├── src/               # React アプリケーションのソースコード
│   ├── App.tsx        # メインアプリケーション
│   ├── main.tsx       # エントリーポイント
│   ├── assets/        # アセット (react.svg)
│   └── *.css          # スタイルシート
├── public/            # 静的アセット (vite.svg)
├── mock/              # デモデータ
│   ├── mock.html      # HTMLデモページ
│   └── skills.json    # スキルデータ
├── dist/              # ビルド出力
└── index.html         # HTMLテンプレート
```

## 開発コマンド

### 現在利用可能なコマンド
```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルドプレビュー
npm run preview

# リント実行
npm run lint

# 依存関係のインストール
npm install
```

### テスト実行
現在テストフレームワークは設定されていません。Vitestの導入を推奨します。

## アーキテクチャ

### 現在の技術スタック
- **フロントエンド**: React 19.1.0 + TypeScript
- **ビルドツール**: Vite 7.0.4
- **スタイリング**: CSS (Tailwind CSS使用可能)
- **高速リフレッシュ**: SWC (Speedy Web Compiler)

### TypeScript設定
- プロジェクトレベル: `tsconfig.json` (参照設定)
- アプリケーション: `tsconfig.app.json`
- Node.js: `tsconfig.node.json`

### ESLint設定
- TypeScript ESLint + React Hooks + React Refresh
- 設定ファイル: `eslint.config.js`
- 推奨設定を使用、必要に応じてtype-aware lintingに対応可能

## データ構造

### スキルデータ (mock/skills.json)
プロフィールページで使用するスキルデータが構造化されています:
- **categories**: スキルカテゴリ配列
  - programming-languages
  - frameworks-libraries
  - databases
  - cloud-devops
  - tools-platforms
- **skills**: 各スキルの詳細情報 (name, level, years, description)

### デモページ (mock/mock.html)
Tailwind CSSを使用したデモページが含まれています。本格的なReactアプリケーションへの移行時の参考になります。

## GitHub Pages設定

- ビルド出力は`dist/`ディレクトリに配置
- GitHub Actionsでの自動デプロイ設定を推奨
- SPAのため、GitHub Pagesでのルーティング設定が必要

## 品質保証

### コード品質
- ESLint: `npm run lint`で実行
- TypeScript: `npm run build`で型チェック
- Biome拡張機能が自動的にフォーマット・リント実行

### テスト戦略
- ユニットテスト: Vitest推奨 (未設定)
- E2Eテスト: Playwright推奨 (未設定)
- 現在テストフレームワークは設定されていません