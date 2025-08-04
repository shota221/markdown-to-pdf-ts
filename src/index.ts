#!/usr/bin/env node

import { Command } from 'commander';
import { glob } from 'glob';
import path from 'path';
import { MarkdownToPDFConverter } from './converter';
import { FontSize } from './types';

const program = new Command();

program
  .name('markdown-to-pdf-ts')
  .description('マークダウンファイルをPDF形式に変換します')
  .version('1.0.0');

program
  .argument('<input...>', '変換するマークダウンファイル（複数指定可能、glob パターン対応）')
  .option('-o, --output <file>', '出力PDFファイル名（単一ファイル変換時のみ）')
  .option('-v, --verbose', '詳細な出力を表示')
  .option('--merge', '複数のマークダウンファイルを一つのPDFにまとめる')
  .option('--no-page-break', '結合時にファイル間の改ページを無効にする（--mergeと併用時のみ有効）')
  .option('--font-size <size>', 'フォントサイズを指定', 'medium')
  .action(async (inputPatterns: string[], options) => {
    try {
      await runConverter(inputPatterns, options);
    } catch (error) {
      console.error(`✗ エラー: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

async function expandGlobPatterns(patterns: string[]): Promise<string[]> {
  const allFiles: string[] = [];
  
  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, { 
        absolute: true,
        nodir: true 
      });
      
      // マークダウンファイルのみをフィルタ
      const markdownFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.md', '.markdown'].includes(ext);
      });
      
      allFiles.push(...markdownFiles);
    } catch (error) {
      console.error(`✗ パターン "${pattern}" の処理中にエラー: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // 重複を除去してソート
  return [...new Set(allFiles)].sort();
}

async function runConverter(inputPatterns: string[], options: any) {
  // ファイルパターンを展開
  const inputFiles = await expandGlobPatterns(inputPatterns);
  
  if (inputFiles.length === 0) {
    throw new Error('変換対象のマークダウンファイルが見つかりません');
  }
  
  // 複数ファイル指定時の出力ファイル名チェック
  if (inputFiles.length > 1 && options.output && !options.merge) {
    throw new Error('複数のファイルを変換する場合、-o オプションは --merge と併用してください');
  }
  
  // フォントサイズの検証
  const validFontSizes: FontSize[] = ['small', 'medium', 'large'];
  if (!validFontSizes.includes(options.fontSize)) {
    throw new Error(`無効なフォントサイズ: ${options.fontSize}. 有効な値: ${validFontSizes.join(', ')}`);
  }
  
  const converter = new MarkdownToPDFConverter(options.fontSize as FontSize);
  
  // 結合モードの場合
  if (options.merge) {
    try {
      if (options.verbose) {
        console.log(`結合中: ${inputFiles.join(', ')}`);
      }
      
      // 改ページオプションを渡す
      const pageBreak = options.pageBreak !== false; // --no-page-break が指定されていない場合は true
      const outputFile = await converter.mergeMarkdownFiles(inputFiles, options.output, pageBreak);
      
      if (options.verbose) {
        console.log(`✓ 結合完了: ${outputFile}`);
      } else {
        console.log(`✓ ${outputFile}`);
      }
      
    } catch (error) {
      throw new Error(`結合処理中にエラー: ${error instanceof Error ? error.message : String(error)}`);
    }
    return;
  }
  
  // 個別変換モード
  let successCount = 0;
  let errorCount = 0;
  
  for (const inputFile of inputFiles) {
    try {
      if (options.verbose) {
        console.log(`変換中: ${inputFile}`);
      }
      
      const outputFile = await converter.convertToPdf(inputFile, options.output);
      
      if (options.verbose) {
        console.log(`✓ 変換完了: ${inputFile} -> ${outputFile}`);
      } else {
        console.log(`✓ ${outputFile}`);
      }
      
      successCount++;
      
    } catch (error) {
      console.error(`✗ エラー: ${inputFile} - ${error instanceof Error ? error.message : String(error)}`);
      errorCount++;
    }
  }
  
  if (options.verbose) {
    console.log(`\n変換結果: 成功 ${successCount}件, エラー ${errorCount}件`);
  }
  
  if (errorCount > 0) {
    process.exit(1);
  }
}

// エラーハンドリング
process.on('unhandledRejection', (reason, promise) => {
  console.error('✗ 未処理のエラー:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('✗ キャッチされていないエラー:', error);
  process.exit(1);
});

// プログラムを実行
program.parse();
