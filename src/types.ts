export interface FontSizeConfig {
  base: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  code: string;
}

export interface FontSizeConfigs {
  small: FontSizeConfig;
  medium: FontSizeConfig;
  large: FontSizeConfig;
}

export type FontSize = 'small' | 'medium' | 'large';

export interface ConversionOptions {
  fontSize?: FontSize;
  pageBreak?: boolean;
  verbose?: boolean;
}

export interface CodeBlockPair {
  start: number;
  end: number;
}

export interface BacktickPosition {
  line: number;
  count: number;
  indent: number;
}
