/**
 * Smart parser for Israeli standard references (ת"י).
 * Extracts standard number and optional part from freetext input.
 *
 * Examples:
 *   "ת"י 1205.1"  → { number: "1205", part: "1", fullKey: "1205.1" }
 *   "תי 1555"     → { number: "1555", fullKey: "1555" }
 *   "1920"         → { number: "1920", fullKey: "1920" }
 *   "ת״י 23 חלק 1" → { number: "23", part: "1", fullKey: "23.1" }
 */

export interface ParsedStandard {
  number: string;
  part?: string;
  fullKey: string;
}

// Pattern 1: Hebrew notation — ת"י / תי / ת״י followed by number and optional part
const HEBREW_PATTERN =
  /(?:ת["״]?י|תי)\s*(\d{1,5})(?:\s*(?:חלק|\.)\s*(\d+(?:\.\d+)?))?/;

// Pattern 2: Bare number with optional dot-separated part
const BARE_NUMBER_PATTERN = /^(\d{2,5})(?:\.(\d+(?:\.\d+)?))?$/;

export function parseStandardRef(input: string): ParsedStandard | null {
  if (!input || !input.trim()) return null;

  const trimmed = input.trim();

  // Try Hebrew notation first
  const hebrewMatch = trimmed.match(HEBREW_PATTERN);
  if (hebrewMatch && hebrewMatch[1]) {
    const number = hebrewMatch[1];
    const part = hebrewMatch[2] ?? undefined;
    return {
      number,
      part,
      fullKey: part ? `${number}.${part}` : number,
    };
  }

  // Fallback: bare number
  const bareMatch = trimmed.match(BARE_NUMBER_PATTERN);
  if (bareMatch && bareMatch[1]) {
    const number = bareMatch[1];
    const part = bareMatch[2] ?? undefined;
    return {
      number,
      part,
      fullKey: part ? `${number}.${part}` : number,
    };
  }

  return null;
}

// ============================================================
// Free-text scanner — extracts standard references from prose
// ============================================================

/**
 * Keyword patterns that anchor a standard reference.
 * A number is only recognized as a standard if preceded by one of these.
 */
const KEYWORD_PATTERN = /(?:ת["״]?י|תי|תקן(?:\s+ישראלי)?|התקן|תקנים|התקנים)/g;

/**
 * After a keyword, captures: number + optional (חלק X | .X) where X can be multi-level (e.g., 3.1)
 */
const NUMBER_WITH_PART = /\s*(\d{1,5})(?:\s*(?:חלק|\.)\s*(\d+(?:\.\d+)?))?/;

/**
 * Scans free text for Israeli standard references.
 * Only recognizes numbers preceded by a keyword (ת"י, תקן, התקנים, etc.).
 * Supports chained references with connectors (ו, comma, +).
 *
 * Examples:
 *   "תקן 1555 חלק 3"                → ["1555.3"]
 *   "התקנים 4004 ו 2378 חלק 2"       → ["4004", "2378.2"]
 *   "ת"י 1555 + 2378 + 1920"         → ["1555", "2378", "1920"]
 *   "בגובה של 20 ס"מ"                → []  (no keyword)
 *   "בחדר 61"                        → []  (no keyword)
 *
 * Returns array of fullKey strings (e.g., "1555.3"). Caller must validate
 * against the israeli_standards DB table — unmatched keys should be discarded.
 */
export function extractStandardRefsFromText(text: string): string[] {
  if (!text || !text.trim()) return [];

  const results = new Set<string>();

  // Reset global regex state
  KEYWORD_PATTERN.lastIndex = 0;

  let keywordMatch: RegExpExecArray | null;
  while ((keywordMatch = KEYWORD_PATTERN.exec(text)) !== null) {
    // Position right after the keyword
    let pos = keywordMatch.index + keywordMatch[0].length;
    const remaining = text.slice(pos);

    // Try to extract the first number after the keyword
    const firstMatch = remaining.match(NUMBER_WITH_PART);
    if (!firstMatch || firstMatch.index === undefined) continue;

    // Ensure the number comes right after the keyword (allow only whitespace)
    const gap = remaining.slice(0, firstMatch.index);
    if (gap.trim().length > 0) continue;

    const number = firstMatch[1] as string;
    const part = firstMatch[2] as string | undefined;
    const fullKey = part ? `${number}.${part}` : number;
    results.add(fullKey);

    // Advance position past this match
    pos += firstMatch.index + firstMatch[0].length;

    // Continue chain: look for connector + number pairs
    const CHAIN_PATTERN =
      /^\s*(?:[,+]|וכן|ו-?)\s*(\d{1,5})(?:\s*(?:חלק|\.)\s*(\d+(?:\.\d+)?))?/;
    let chainText = text.slice(pos);
    let chainMatch: RegExpMatchArray | null;
    while ((chainMatch = chainText.match(CHAIN_PATTERN)) !== null) {
      const chainNumber = chainMatch[1] as string;
      const chainPart = chainMatch[2] as string | undefined;
      const chainFullKey = chainPart
        ? `${chainNumber}.${chainPart}`
        : chainNumber;
      results.add(chainFullKey);
      chainText = chainText.slice(chainMatch[0].length);
    }

    // Advance the keyword regex past the chain we just consumed
    KEYWORD_PATTERN.lastIndex = text.length - chainText.length;
  }

  return [...results];
}
