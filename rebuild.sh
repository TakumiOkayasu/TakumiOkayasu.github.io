#!/bin/bash

echo "=== Rollupビルドエラーの解決 ==="

# 1. キャッシュとnode_modulesをクリーンアップ
echo "1. クリーンアップを実行..."
rm -rf node_modules
rm -f bun.lockb package-lock.json yarn.lock pnpm-lock.yaml

# 2. Bunのキャッシュをクリア
echo "2. Bunのキャッシュをクリア..."
bun pm cache rm

# 3. 必要なパッケージを明示的にインストール
echo "3. Rollup関連パッケージを再インストール..."
bun add -D @rollup/rollup-linux-arm64-gnu rollup

# 4. すべての依存関係を再インストール
echo "4. すべての依存関係を再インストール..."
bun install

# 5. 代替案: package.jsonに追加
echo "5. package.jsonにoverrideを追加（オプション）"
cat > package-override.json << 'EOF'
{
  "overrides": {
    "rollup": "^4.24.0"
  },
  "resolutions": {
    "rollup": "^4.24.0"
  }
}
EOF

# 6. Viteのキャッシュもクリア
echo "6. Viteのキャッシュをクリア..."
rm -rf node_modules/.vite

# 7. 環境変数の設定（ARM64用）
echo "7. 環境変数を設定..."
export ROLLUP_BINARY_PATH=node_modules/@rollup/rollup-linux-arm64-gnu/rollup.linux-arm64-gnu.node

echo "完了！もう一度ビルドを試してください："
echo "bun run build"