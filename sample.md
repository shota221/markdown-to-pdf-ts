# サンプルドキュメント

[TOC]

## 概要

このドキュメントは、Markdown to PDF コンバーターのテスト用サンプルです。さまざまなマークダウン要素が正しくPDFに変換されるかを確認するために作成されています。

## テキスト装飾

### 基本的な装飾

- **太字テキスト**
- *斜体テキスト*
- ~~取り消し線~~
- `インラインコード`

### 組み合わせ

***太字かつ斜体***のテキストや、**太字の中に`コード`を含む**こともできます。

## リスト

### 順序なしリスト

- 項目1
- 項目2
  - サブ項目2.1
  - サブ項目2.2
    - サブサブ項目2.2.1
- 項目3

### 順序付きリスト

1. 最初の項目
2. 二番目の項目
   1. サブ項目2.1
   2. サブ項目2.2
3. 三番目の項目

### タスクリスト

- [x] 完了したタスク
- [ ] 未完了のタスク
- [x] もう一つの完了したタスク

## コードブロック

### Python

```python
def fibonacci(n):
    """フィボナッチ数列を生成する関数"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 使用例
for i in range(10):
    print(f"fibonacci({i}) = {fibonacci(i)}")
```

### JavaScript

```javascript
// 配列の処理例
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);

// 非同期処理
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### SQL

```sql
-- ユーザーテーブルの作成
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- データの挿入
INSERT INTO users (name, email) VALUES 
    ('田中太郎', 'tanaka@example.com'),
    ('佐藤花子', 'sato@example.com');

-- データの検索
SELECT name, email 
FROM users 
WHERE created_at >= '2024-01-01'
ORDER BY name;
```

## 表

### 基本的な表

| 項目 | 説明 | 値 |
|------|------|-----|
| CPU | プロセッサー | Intel Core i7 |
| RAM | メモリ | 16GB |
| Storage | ストレージ | 512GB SSD |

### 複雑な表

| プログラミング言語 | タイプ | 用途 | 学習難易度 |
|:-------------------|:------:|:-----|----------:|
| Python | インタープリター | データサイエンス、Web開発 | ★★☆☆☆ |
| JavaScript | インタープリター | Web開発、サーバーサイド | ★★★☆☆ |
| Java | コンパイル | エンタープライズ、Android | ★★★★☆ |
| C++ | コンパイル | システム、ゲーム開発 | ★★★★★ |

## 引用

### 単一行引用

> プログラミングは芸術であり、科学である。

### 複数行引用

> コンピューターサイエンスにおいて最も重要なことは、
> 問題を解決することではなく、
> 正しい問題を見つけることである。
> 
> — エドガー・ダイクストラ

### ネストした引用

> これは最初の引用レベルです。
> 
> > これは二番目の引用レベルです。
> > 
> > > そしてこれは三番目の引用レベルです。

## リンクと画像

### リンク

- [Google](https://www.google.com)
- [GitHub](https://github.com)
- [Stack Overflow](https://stackoverflow.com)

### 画像

![テスト画像](test.svg)

### 自動リンク

https://www.example.com

### メールアドレス

contact@example.com

## 水平線

以下に水平線を表示します：

---

上記が水平線です。

## 数学的表現

インライン数学: `E = mc²`

数学ブロック:
```
∫₀¹ x² dx = [x³/3]₀¹ = 1/3
```

## 特殊文字とエスケープ

- アスタリスク: \*
- アンダースコア: \_
- バックスラッシュ: \\
- バッククォート: \`

## HTML要素

<details>
<summary>詳細情報（クリックして展開）</summary>

この部分は通常は隠されていますが、summaryをクリックすると表示されます。

- HTMLの`details`要素を使用
- マークダウンとHTMLの混在使用例

</details>

## まとめ

このサンプルドキュメントでは、以下のマークダウン要素をテストしました：

1. 見出し（H1〜H6）
2. テキスト装飾（太字、斜体、取り消し線、コード）
3. リスト（順序付き、順序なし、タスク）
4. コードブロック（シンタックスハイライト付き）
5. 表（左揃え、中央揃え、右揃え）
6. 引用（単一行、複数行、ネスト）
7. リンクと画像
8. 水平線
9. 特殊文字とエスケープ
10. HTML要素

PDF変換が正常に動作することを確認してください。
