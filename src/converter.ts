import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { FontSize, FontSizeConfig, FontSizeConfigs } from './types';

export class MarkdownToPDFConverter {
  private fontSize: FontSize;
  private cssStyles: string;

  constructor(fontSize: FontSize = 'medium') {
    this.fontSize = fontSize;
    
    // Configure marked with syntax highlighting
    marked.use(markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    }));

    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    this.cssStyles = this.getCssStyles();
  }

  private getFontSizes(): FontSizeConfig {
    const fontSizeConfigs: FontSizeConfigs = {
      small: { base: '10px', h1: '20px', h2: '16px', h3: '14px', h4: '12px', code: '9px' },
      medium: { base: '12px', h1: '24px', h2: '20px', h3: '18px', h4: '16px', code: '11px' },
      large: { base: '14px', h1: '28px', h2: '24px', h3: '22px', h4: '20px', code: '13px' }
    };
    return fontSizeConfigs[this.fontSize] || fontSizeConfigs.medium;
  }

  private getCssStyles(): string {
    const sizes = this.getFontSizes();
    
    return `
      @page { size: A4; margin: 2cm; }
      
      body {
        font-family: Arial, sans-serif;
        font-size: ${sizes.base};
        line-height: 1.6;
        color: #333;
        max-width: none;
      }
      
      h1, h2, h3, h4, h5, h6 {
        color: #2c3e50;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        page-break-after: avoid;
      }
      
      h1 { font-size: ${sizes.h1}; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
      h2 { font-size: ${sizes.h2}; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
      h3 { font-size: ${sizes.h3}; }
      h4 { font-size: ${sizes.h4}; }
      
      p { margin-bottom: 1em; text-align: justify; }
      
      strong, b { font-weight: 900 !important; color: #000 !important; }
      em, i { font-style: italic !important; color: #333 !important; transform: skew(-15deg) !important; display: inline-block !important; }
      del, s { text-decoration: line-through !important; color: #666 !important; }
      
      code {
        background-color: #f8f8f8;
        border: 1px solid #e1e1e8;
        border-radius: 3px;
        padding: 2px 4px;
        font-family: monospace;
        font-size: ${sizes.code};
        word-wrap: break-word;
      }
      
      pre {
        background-color: #f8f8f8;
        border: 1px solid #e1e1e8;
        border-radius: 5px;
        padding: 10px;
        overflow-x: auto;
        page-break-inside: avoid;
        white-space: pre-wrap;
        word-wrap: break-word;
        line-height: 1.4;
      }
      
      pre code {
        background-color: transparent;
        border: none;
        padding: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        line-height: inherit;
      }
      
      table { border-collapse: collapse; width: 100%; margin: 1em 0; page-break-inside: avoid; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; font-weight: bold; }
      tr:nth-child(even) { background-color: #f9f9f9; }
      
      ul, ol { margin: 1em 0; padding-left: 2em; }
      li { margin-bottom: 0.5em; }
      
      /* 最重要：タスクリストのスタイル */
      ul.task-list {
        padding-left: 0 !important;
        list-style: none !important;
        list-style-type: none !important;
      }
      
      ul.task-list > li {
        list-style: none !important;
        list-style-type: none !important;
        position: relative;
        padding-left: 1.5em !important;
        margin-bottom: 0.5em;
        margin-left: 0 !important;
      }
      
      ul.task-list > li::before,
      ul.task-list > li::after,
      ul.task-list > li::marker {
        display: none !important;
        content: none !important;
      }
      
      .task-list-control {
        position: absolute;
        left: 0;
        top: 0;
        width: 1.2em;
      }
      
      .task-list-control input[type="checkbox"] {
        display: none !important;
      }
      
      .task-list-control input[type="checkbox"] + .task-list-indicator::before {
        content: "☐";
        color: #666;
        font-size: 1em;
        font-weight: bold;
      }
      
      .task-list-control input[type="checkbox"]:checked + .task-list-indicator::before,
      .task-list-control input[type="checkbox"][checked] + .task-list-indicator::before {
        content: "☑";
        color: #3498db !important;
        font-size: 1em;
        font-weight: bold;
      }
      
      blockquote { border-left: 4px solid #3498db; margin: 1em 0; padding-left: 1em; color: #666; font-style: italic; }
      a { color: #3498db; text-decoration: none; }
      a:hover { text-decoration: underline; }
      
      img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1em auto;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 5px;
        background-color: #fff;
      }
      
      .page-break { page-break-before: always; }
      .file-separator { page-break-before: always; border-top: 2px solid #ddd; margin-top: 2em; padding-top: 1em; }

      /* Syntax highlighting */
      .hljs { display: block; overflow-x: auto; padding: 0.5em; background: #f8f8f8; }
      .hljs-comment, .hljs-quote { color: #998; font-style: italic; }
      .hljs-keyword, .hljs-selector-tag, .hljs-subst { color: #333; font-weight: bold; }
      .hljs-number, .hljs-literal, .hljs-variable, .hljs-template-variable, .hljs-tag .hljs-attr { color: #008080; }
      .hljs-string, .hljs-doctag { color: #d14; }
      .hljs-title, .hljs-section, .hljs-selector-id { color: #900; font-weight: bold; }
      .hljs-type, .hljs-class .hljs-title { color: #458; font-weight: bold; }
      .hljs-tag, .hljs-name, .hljs-attribute { color: #000080; font-weight: normal; }
      .hljs-regexp, .hljs-link { color: #009926; }
      .hljs-symbol, .hljs-bullet { color: #990073; }
      .hljs-built_in, .hljs-builtin-name { color: #0086b3; }
      .hljs-meta { color: #999; font-weight: bold; }
      .hljs-deletion { background: #fdd; }
      .hljs-addition { background: #dfd; }
      .hljs-emphasis { font-style: italic; }
      .hljs-strong { font-weight: bold; }
    `;
  }

  private convertMarkdownToHtml(markdownContent: string): string {
    // ネストしたコードブロックの前処理
    const processedContent = this.preprocessNestedCodeblocks(markdownContent);
    
    let htmlContent = marked(processedContent);
    
    // ネストしたコードブロックの後処理
    htmlContent = this.postprocessNestedCodeblocks(htmlContent);
    
    // 取り消し線処理
    htmlContent = htmlContent.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    
    // タスクリスト処理
    htmlContent = htmlContent.replace(
      /<li><input\s+([^>]*type="checkbox"[^>]*)>\s*/g,
      '<li class="task-list-item"><span class="task-list-control"><input $1><span class="task-list-indicator"></span></span>'
    );
    
    htmlContent = htmlContent.replace(
      /<ul>(\s*<li class="task-list-item">)/g,
      '<ul class="task-list">$1'
    );
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown to PDF</title>
    <style>${this.cssStyles}</style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
  }

  private preprocessNestedCodeblocks(markdownContent: string): string {
    return this.processCodeblocksCorrectly(markdownContent);
  }

  private processCodeblocksCorrectly(markdownContent: string): string {
    const placeholder = "___NESTED_CODEBLOCK_DELIMITER___";
    const lines = markdownContent.split('\n');
    const resultLines: string[] = [];
    
    // 全ての```の位置を特定（3つ以上の連続したバッククォート）
    const backtickPositions: Array<{pos: number, count: number, indent: number}> = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const stripped = line.trim();
      if (stripped.startsWith('```') && stripped.length >= 3) {
        // ```で始まり、最初の3文字がすべて`であることを確認
        let backtickCount = 0;
        for (const char of stripped) {
          if (char === '`') {
            backtickCount++;
          } else {
            break;
          }
        }
        if (backtickCount >= 3) {
          const indent = line.length - line.trimStart().length;
          backtickPositions.push({pos: i, count: backtickCount, indent});
        }
      }
    }
    
    // 対になる```を見つける
    const codeblockPairs: Array<{start: number, end: number}> = [];
    const stack: Array<{pos: number, indent: number, count: number}> = [];
    
    for (const {pos, count: backtickCount, indent} of backtickPositions) {
      const line = lines[pos];
      const stripped = line.trim();
      
      if (stack.length === 0) {
        // 新しいコードブロック開始
        stack.push({pos, indent, count: backtickCount});
      } else {
        // スタックから適切な開始位置を見つける
        let foundMatch = false;
        for (let j = stack.length - 1; j >= 0; j--) {
          const {pos: startPos, indent: startIndent, count: startBacktickCount} = stack[j];
          // 同じバッククォート数で、同じか小さいインデントの場合にマッチ
          if (indent <= startIndent && 
              backtickCount === startBacktickCount && 
              stripped === '`'.repeat(backtickCount)) {
            // マッチする終了位置を発見
            codeblockPairs.push({start: startPos, end: pos});
            // この位置以降のスタック要素を削除
            stack.splice(j);
            foundMatch = true;
            break;
          }
        }
        
        if (!foundMatch) {
          // 新しいコードブロック開始として扱う
          stack.push({pos, indent, count: backtickCount});
        }
      }
    }
    
    // コードブロック内の```を置き換え
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let shouldReplace = false;
      
      // この行がコードブロック内にあるかチェック
      for (const {start, end} of codeblockPairs) {
        if (start < i && i < end && line.includes('```')) {
          shouldReplace = true;
          break;
        }
      }
      
      if (shouldReplace) {
        resultLines.push(line.replace(/```/g, placeholder));
      } else {
        resultLines.push(line);
      }
    }
    
    return resultLines.join('\n');
  }

  private postprocessNestedCodeblocks(htmlContent: string): string {
    const placeholder = "___NESTED_CODEBLOCK_DELIMITER___";
    
    let result = htmlContent;
    
    // まず、通常の置換を試行
    result = result.replace(new RegExp(placeholder, 'g'), '```');
    
    // 観察された実際のHTMLパターンを置換
    // __<span class="hljs-emphasis">_NESTED_</span>CODEBLOCK<span class="hljs-emphasis">_DELIMITER_</span>__
    result = result.replace(
      /__<span class="hljs-emphasis">_NESTED_<\/span>CODEBLOCK<span class="hljs-emphasis">_DELIMITER_<\/span>__/g,
      '```'
    );
    
    // さらに外側の<span>タグがある場合
    result = result.replace(
      /<span class="hljs-strong">__<span class="hljs-emphasis">_NESTED_<\/span>CODEBLOCK<span class="hljs-emphasis">_DELIMITER_<\/span>__<\/span>/g,
      '```'
    );
    
    // その他の可能性のあるパターン
    result = result.replace(
      /<span[^>]*>___NESTED_CODEBLOCK_DELIMITER__<\/span>[^<]*/g,
      '```'
    );
    
    return result;
  }

  private async convertImageToDataUri(imagePath: string): Promise<string> {
    try {
      console.log(`画像ファイル読み込み開始: ${imagePath}`);
      const imageBuffer = await fs.readFile(imagePath);
      console.log(`画像ファイル読み込み成功、サイズ: ${imageBuffer.length} bytes`);
      const ext = path.extname(imagePath).toLowerCase();
      let mimeType = 'image/png'; // デフォルト
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          mimeType = 'image/jpeg';
          break;
        case '.png':
          mimeType = 'image/png';
          break;
        case '.gif':
          mimeType = 'image/gif';
          break;
        case '.webp':
          mimeType = 'image/webp';
          break;
        case '.svg':
          mimeType = 'image/svg+xml';
          break;
        case '.bmp':
          mimeType = 'image/bmp';
          break;
        default:
          console.warn(`未知の画像形式: ${ext}, PNG として処理します`);
      }
      
      const base64Data = imageBuffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64Data}`;
      console.log(`Base64エンコード完了、MIME: ${mimeType}`);
      return dataUri;
    } catch (error) {
      console.warn(`画像ファイルの読み込みに失敗: ${imagePath}`, error);
      return imagePath; // 元のパスを返す
    }
  }

  async convertToPdf(inputFile: string, outputFile?: string): Promise<string> {
    const stats = await fs.stat(inputFile);
    if (!stats.isFile()) {
      throw new Error(`入力ファイルが見つかりません: ${inputFile}`);
    }
    
    const ext = path.extname(inputFile).toLowerCase();
    if (!['.md', '.markdown'].includes(ext)) {
      throw new Error('入力ファイルはマークダウンファイル(.md または .markdown)である必要があります');
    }
    
    if (!outputFile) {
      const parsed = path.parse(inputFile);
      outputFile = path.join(parsed.dir, `${parsed.name}.pdf`);
    }
    
    const markdownContent = await fs.readFile(inputFile, 'utf-8');
    let htmlContent = this.convertMarkdownToHtml(markdownContent);
    
    // DEBUG_HTML環境変数が設定されている場合、HTMLをファイルに出力
    if (process.env.DEBUG_HTML) {
      const debugFile = outputFile.replace('.pdf', '.debug.html');
      await fs.writeFile(debugFile, htmlContent, 'utf-8');
      console.log(`デバッグHTML出力: ${debugFile}`);
    }
    
    // 画像をBase64エンコードして埋め込み
    const baseDir = path.dirname(path.resolve(inputFile));
    const imgRegex = /src="([^"]+)"/g;
    const imageSources: string[] = [];
    let match;
    
    // 全ての画像srcを抽出
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const src = match[1];
      if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('file:')) {
        imageSources.push(src);
      }
    }
    
    console.log(`発見された画像: ${imageSources.length}個`, imageSources);
    
    // 各画像をBase64エンコードして置換
    for (const src of imageSources) {
      const imagePath = path.join(baseDir, src);
      console.log(`画像をエンコード中: ${imagePath}`);
      const dataUri = await this.convertImageToDataUri(imagePath);
      console.log(`エンコード結果: ${dataUri.substring(0, 50)}...`);
      htmlContent = htmlContent.replace(
        new RegExp(`src="${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
        `src="${dataUri}"`
      );
    }
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      await page.pdf({
        path: outputFile,
        format: 'A4',
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
        printBackground: true
      });
    } finally {
      await browser.close();
    }
    
    return outputFile;
  }

  async mergeMarkdownFiles(inputFiles: string[], outputFile?: string, pageBreak: boolean = true): Promise<string> {
    if (inputFiles.length === 0) {
      throw new Error('入力ファイルが指定されていません');
    }
    
    if (!outputFile) {
      const firstFile = path.parse(inputFiles[0]);
      outputFile = path.join(firstFile.dir, `${firstFile.name}_merged.pdf`);
    }
    
    const combinedContent: string[] = [];
    
    for (let i = 0; i < inputFiles.length; i++) {
      const inputFile = inputFiles[i];
      
      const stats = await fs.stat(inputFile);
      if (!stats.isFile()) {
        throw new Error(`入力ファイルが見つかりません: ${inputFile}`);
      }
      
      const ext = path.extname(inputFile).toLowerCase();
      if (!['.md', '.markdown'].includes(ext)) {
        throw new Error(`入力ファイルはマークダウンファイル(.md または .markdown)である必要があります: ${inputFile}`);
      }
      
      const content = await fs.readFile(inputFile, 'utf-8');
      
      if (i > 0) {
        if (pageBreak) {
          combinedContent.push('\n\n<div class="page-break"></div>\n\n');
        } else {
          combinedContent.push('\n\n');
        }
      }
      
      combinedContent.push(content.trim());
    }
    
    const mergedMarkdown = combinedContent.join('');
    let htmlContent = this.convertMarkdownToHtml(mergedMarkdown);
    
    // 画像をBase64エンコードして埋め込み（最初のファイルのディレクトリを基準とする）
    const baseDir = path.dirname(path.resolve(inputFiles[0]));
    const imgRegex = /src="([^"]+)"/g;
    const imageSources: string[] = [];
    let match;
    
    // 全ての画像srcを抽出
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const src = match[1];
      if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('file:')) {
        imageSources.push(src);
      }
    }
    
    // 各画像をBase64エンコードして置換
    for (const src of imageSources) {
      const imagePath = path.join(baseDir, src);
      const dataUri = await this.convertImageToDataUri(imagePath);
      htmlContent = htmlContent.replace(
        new RegExp(`src="${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
        `src="${dataUri}"`
      );
    }
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      await page.pdf({
        path: outputFile,
        format: 'A4',
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
        printBackground: true
      });
    } finally {
      await browser.close();
    }
    
    return outputFile;
  }
}
