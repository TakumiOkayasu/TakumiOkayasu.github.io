# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリは `takumiokayasu.github.io` のGitHub Pagesプロジェクトです。現在は初期段階にあり、個人のプロフィールページまたはポートフォリオサイトとして開発される予定です。

## 開発環境

### Dev Container
このプロジェクトは`.devcontainer`を使用した開発環境が構築されています:
- **ランタイム**: Bun (高速JavaScriptランタイム)
- **代替ランタイム**: Node.js LTS, npm, pnpm
- **コードフォーマッター**: Biome (VS Code拡張機能)
- **タイムゾーン**: Asia/Tokyo
- **ロケール**: ja_JP.UTF-8

### 開発環境の起動
```bash
# VS CodeでDev Containerを起動
# 「Reopen in Container」を実行
```

## プロジェクト構造

現在のプロジェクトは初期状態ですが、GitHub Pagesプロジェクトとして以下の構造が推奨されます:

```
/
├── .devcontainer/     # Dev Container設定
├── src/               # ソースコード (今後作成)
├── public/            # 静的アセット (今後作成)
├── dist/              # ビルド出力 (今後作成)
└── package.json       # プロジェクト設定 (今後作成)
```

## 開発コマンド

### 現在利用可能なコマンド
```bash
# パッケージマネージャー (package.json作成後)
bun install           # 依存関係のインストール
bun add [package]     # パッケージの追加
bun run [script]      # スクリプトの実行

# 代替コマンド
pnpm install
npm install
```

### 今後追加予定のコマンド
プロジェクトのセットアップ後、以下のコマンドが利用可能になります:
```bash
bun run dev          # 開発サーバー起動
bun run build        # プロダクションビルド
bun run preview      # ビルドプレビュー
bun run lint         # Biomeでのリント
bun run format       # Biomeでのフォーマット
bun test             # テスト実行
```

## アーキテクチャ指針

### 静的サイトジェネレーター選定基準
GitHub Pagesでのホスティングを考慮して、以下の選択肢があります:
1. **Astro**: 高速な静的サイト生成、コンポーネント指向
2. **Vite + vanilla**: シンプルなSPA構築
3. **Next.js**: 静的エクスポート機能を使用

### コンポーネント設計
- 再利用可能なコンポーネントは`src/components/`に配置
- ページコンポーネントは`src/pages/`に配置
- スタイリングはCSS ModulesまたはTailwind CSSを推奨

### GitHub Pages設定
- ビルド出力は`dist/`ディレクトリに配置
- GitHub Actionsでの自動デプロイ設定を推奨
- カスタムドメイン使用時はCNAMEファイルを`public/`に配置

## 品質保証

### コード品質
- Biome拡張機能が自動的にフォーマット・リントを実行
- コミット前に`bun run lint`でチェック

### テスト戦略
- ユニットテスト: Vitest推奨
- E2Eテスト: Playwright推奨
- ビジュアルリグレッションテスト: 必要に応じて検討

## 注意事項

1. **ブランチ戦略**: 
   - `main`ブランチがGitHub Pagesにデプロイされます
   - 機能開発は別ブランチで行い、PRでマージ

2. **アセット管理**:
   - 画像は`public/images/`に配置
   - WebP形式への変換を推奨 (Docker環境にツール導入済み)

3. **パフォーマンス**:
   - Lighthouse CI の導入を検討
   - 画像の遅延読み込みを実装

4. **アクセシビリティ**:
   - セマンティックHTMLを使用
   - 適切なARIA属性を追加
   - キーボードナビゲーション対応