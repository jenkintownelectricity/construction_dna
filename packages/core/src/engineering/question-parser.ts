/**
 * QUESTION PARSER
 *
 * Parses natural language engineering questions into structured data
 */

import type { QuestionIntent, ParsedQuestion, QuestionEntities } from './types';

/**
 * Pattern definitions for intent detection
 */
const INTENT_PATTERNS: Record<QuestionIntent, RegExp[]> = {
  'failure-prediction': [
    /what happens if/i,
    /what will happen/i,
    /what goes wrong/i,
    /what could go wrong/i,
    /what (will|would) fail/i,
    /failure mode/i,
    /water gets behind/i,
    /moisture (gets|enters)/i,
    /if .* fails/i,
    /risk of/i,
    /what are the risks/i,
  ],
  'compatibility-check': [
    /compatible/i,
    /incompatible/i,
    /can i use .* with/i,
    /can .* touch/i,
    /can .* contact/i,
    /next to/i,
    /against/i,
    /in contact with/i,
    /use .* over/i,
    /apply .* to/i,
    /work with/i,
  ],
  'temperature-check': [
    /temperature/i,
    /\d+\s*°?\s*[fFcC]/,
    /cold weather/i,
    /hot weather/i,
    /freeze/i,
    /freezing/i,
    /apply .* at/i,
    /install .* at/i,
    /minimum .* temp/i,
    /maximum .* temp/i,
    /too cold/i,
    /too hot/i,
  ],
  'application-guidance': [
    /how (do|to|should) i/i,
    /how is .* (installed|applied)/i,
    /installation/i,
    /procedure/i,
    /steps to/i,
    /best way to/i,
    /proper way/i,
    /correct method/i,
    /instructions/i,
  ],
  'material-properties': [
    /what is the .* of/i,
    /what are the .* of/i,
    /specifications/i,
    /spec sheet/i,
    /perm rating/i,
    /tensile strength/i,
    /elongation/i,
    /thickness/i,
    /properties of/i,
    /characteristics/i,
  ],
  'code-compliance': [
    /code/i,
    /ibc/i,
    /irc/i,
    /iecc/i,
    /astm/i,
    /comply/i,
    /compliant/i,
    /requirement/i,
    /fire rat/i,
    /class [abc]/i,
    /fm approval/i,
    /ul listing/i,
  ],
  'troubleshooting': [
    /why did .* fail/i,
    /why is .* (failing|leaking)/i,
    /troubleshoot/i,
    /diagnose/i,
    /what caused/i,
    /root cause/i,
    /problem with/i,
    /issue with/i,
  ],
  'material-selection': [
    /what (should|would) i use/i,
    /which .* (should|would)/i,
    /best .* for/i,
    /recommend/i,
    /suggest/i,
    /alternative/i,
    /substitute/i,
    /replacement for/i,
  ],
  comparison: [
    /compare/i,
    /difference between/i,
    /vs\.?/i,
    /versus/i,
    /better than/i,
    /which is better/i,
    /pros and cons/i,
    /.* or .*/i,
  ],
  general: [], // Fallback
};

/**
 * Chemistry keywords
 */
const CHEMISTRY_KEYWORDS = [
  'epdm',
  'tpo',
  'pvc',
  'sbs',
  'app',
  'hdpe',
  'ldpe',
  'bitumen',
  'asphalt',
  'silicone',
  'polyurethane',
  'acrylic',
  'rubber',
  'thermoplastic',
  'thermoset',
  'modified bitumen',
  'mod bit',
  'single-ply',
  'single ply',
  'built-up',
  'bur',
  'fluid-applied',
  'self-adhered',
  'peel and stick',
];

/**
 * Condition keywords
 */
const CONDITION_KEYWORDS = [
  'water',
  'moisture',
  'wet',
  'rain',
  'ponding',
  'standing water',
  'uv',
  'ultraviolet',
  'sun',
  'exposure',
  'sunlight',
  'cold',
  'hot',
  'freeze',
  'heat',
  'thermal',
  'wind',
  'uplift',
  'traffic',
  'foot traffic',
  'walking',
  'chemical',
  'oil',
  'solvent',
  'grease',
  'petroleum',
  'acid',
  'alkali',
  'salt',
  'ozone',
];

/**
 * Failure keywords
 */
const FAILURE_KEYWORDS = [
  'leak',
  'leaking',
  'blister',
  'blistering',
  'crack',
  'cracking',
  'split',
  'splitting',
  'delamination',
  'delaminate',
  'peel',
  'peeling',
  'disbond',
  'adhesion',
  'seam',
  'separation',
  'puncture',
  'tear',
  'shrink',
  'shrinkage',
  'embrittle',
  'brittle',
  'soften',
  'swell',
  'uplift',
  'blow-off',
];

/**
 * Stop words to filter out
 */
const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'must',
  'can',
  'to',
  'of',
  'in',
  'for',
  'on',
  'with',
  'at',
  'by',
  'from',
  'as',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'between',
  'under',
  'again',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  'just',
  'and',
  'but',
  'if',
  'or',
  'because',
  'until',
  'while',
  'this',
  'that',
  'these',
  'those',
  'what',
  'which',
  'who',
  'whom',
  'i',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'you',
  'your',
  'he',
  'him',
  'his',
  'she',
  'her',
  'it',
  'its',
  'they',
  'them',
  'their',
]);

/**
 * Question Parser
 */
export class QuestionParser {
  /**
   * Parse a natural language question
   */
  parse(question: string): ParsedQuestion {
    const intent = this.detectIntent(question);
    const keywords = this.extractKeywords(question);
    const entities = this.extractEntities(question);
    const confidence = this.calculateConfidence(question, intent, entities);

    return {
      original: question,
      intent,
      keywords,
      entities,
      confidence,
    };
  }

  /**
   * Detect the intent of the question
   */
  private detectIntent(question: string): QuestionIntent {
    const scores: Record<QuestionIntent, number> = {
      'failure-prediction': 0,
      'compatibility-check': 0,
      'temperature-check': 0,
      'application-guidance': 0,
      'material-properties': 0,
      'code-compliance': 0,
      troubleshooting: 0,
      'material-selection': 0,
      comparison: 0,
      general: 0,
    };

    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(question)) {
          scores[intent as QuestionIntent] += 1;
        }
      }
    }

    // Find highest scoring intent
    let maxScore = 0;
    let bestIntent: QuestionIntent = 'general';

    for (const [intent, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent as QuestionIntent;
      }
    }

    return bestIntent;
  }

  /**
   * Extract meaningful keywords
   */
  private extractKeywords(question: string): string[] {
    const words = question
      .toLowerCase()
      .replace(/[^\w\s°-]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 1 && !STOP_WORDS.has(word));

    return [...new Set(words)];
  }

  /**
   * Extract entities from the question
   */
  private extractEntities(question: string): QuestionEntities {
    const lower = question.toLowerCase();

    // Extract chemistries
    const chemistries = CHEMISTRY_KEYWORDS.filter((c) => lower.includes(c));

    // Extract temperatures
    const temperatures: Array<{ value: number; unit: 'F' | 'C' }> = [];
    const tempMatches = question.matchAll(/(-?\d+)\s*°?\s*([fFcC])/g);
    for (const match of tempMatches) {
      temperatures.push({
        value: parseInt(match[1]),
        unit: match[2].toUpperCase() as 'F' | 'C',
      });
    }

    // Extract conditions
    const conditions = CONDITION_KEYWORDS.filter((c) => lower.includes(c));

    // Extract failures
    const failures = FAILURE_KEYWORDS.filter((f) => lower.includes(f));

    // Extract material names (capitalized words that might be products)
    const materialMatches = question.match(/[A-Z][A-Z0-9-]+/g) || [];
    const materials = materialMatches.filter((m) => m.length > 2);

    return {
      materials,
      chemistries,
      temperatures,
      conditions,
      failures,
    };
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    _question: string,
    intent: QuestionIntent,
    entities: QuestionEntities,
  ): number {
    let confidence = 0.5; // Base confidence

    // Higher confidence if we found entities
    if (entities.chemistries.length > 0) confidence += 0.1;
    if (entities.materials.length > 0) confidence += 0.1;
    if (entities.conditions.length > 0) confidence += 0.1;
    if (entities.temperatures.length > 0) confidence += 0.1;

    // Higher confidence for specific intents vs general
    if (intent !== 'general') confidence += 0.1;

    // Cap at 0.95
    return Math.min(confidence, 0.95);
  }
}
