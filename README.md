# Markdown to PDF Converter (TypeScript)

マークダウンファイルをPDF形式に変換するTypeScript製のコマンドラインツールです。

## 特徴

- マークダウンからPDFへの高品質な変換
- シンタックスハイライト対応
- 複数ファイルの結合機能
- カスタマイズ可能なフォントサイズ
- 日本語対応
- ネストしたコードブロックのサポート
- タスクリスト（チェックボックス）のサポート
- 表、画像、リンクなどの豊富なマークダウン要素に対応

## インストール

### 前提条件

- Node.js (v16 以上)
- npm または yarn

### セットアップ

```bash
# プロジェクトのクローンまたはダウンロード
cd tools/markdown-to-pdf-ts

# 依存関係のインストール
npm install

# TypeScriptコンパイル
npm run build
```

## 使用方法

### 基本的な使用方法

```bash
# 単一ファイルの変換
npm start input.md

# 出力ファイル名を指定
npm start input.md -- -o output.pdf

# 複数ファイルの個別変換
npm start *.md

# 複数ファイルを一つのPDFに結合
npm start file1.md file2.md file3.md -- --merge

# 結合時の出力ファイル名を指定
npm start file1.md file2.md -- --merge -o combined.pdf

# 結合時の改ページを無効化
npm start file1.md file2.md -- --merge --no-page-break

# フォントサイズを指定
npm start input.md -- --font-size large

# 詳細出力モード
npm start input.md -- --verbose
```

### コマンドラインオプション

- `-o, --output <file>`: 出力PDFファイル名（単一ファイル変換時のみ）
- `-v, --verbose`: 詳細な出力を表示
- `--merge`: 複数のマークダウンファイルを一つのPDFにまとめる
- `--no-page-break`: 結合時にファイル間の改ページを無効にする（--mergeと併用時のみ有効）
- `--font-size <size>`: フォントサイズを指定 (small, medium, large)

### Globパターンのサポート

ファイル指定にglobパターンを使用できます：

```bash
# すべての.mdファイルを変換
npm start "**/*.md"

# 特定のディレクトリの.mdファイルを変換
npm start "docs/*.md"

# パターンマッチングで複数ファイルを結合
npm start "chapter*.md" -- --merge -o book.pdf
```

## 開発

### 開発環境のセットアップ

```bash
# 開発モード（ファイル監視）
npm run dev

# ビルド
npm run build

# クリーンアップ
npm run clean
```

### プロジェクト構造

```
tools/markdown-to-pdf-ts/
├── src/
│   ├── index.ts          # CLIエントリーポイント
│   ├── converter.ts      # メインのコンバータークラス
│   └── types.ts          # 型定義
├── dist/                 # コンパイル済みJavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 技術スタック

- **TypeScript**: メイン言語
- **marked**: Markdownパーサー
- **marked-highlight**: シンタックスハイライト
- **highlight.js**: コードハイライト
- **puppeteer**: PDF生成
- **commander**: CLI構築
- **glob**: ファイルパターンマッチング

## サポートするマークダウン機能

- ヘッダー (H1-H6)
- テキスト装飾 (太字、斜体、取り消し線)
- リスト (順序付き、順序なし)
- タスクリスト (チェックボックス)
- 表
- コードブロック（シンタックスハイライト付き）
- インラインコード
- 引用
- リンク
- 画像
- 水平線
- 改行

## PDF出力の特徴

- A4サイズ、2cmマージン
- 日本語フォント対応
- 改ページ制御
- シンタックスハイライト
- レスポンシブ画像
- 印刷に適したスタイリング

## ライセンス

MIT License

## 元のPythonバージョンとの違い

- Puppeteerを使用したより安定したPDF生成
- Node.jsエコシステムとの統合
- TypeScriptによる型安全性
- より柔軟なglobパターンサポート
- 改善されたエラーハンドリング
