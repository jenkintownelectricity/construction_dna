/**
 * TAXONOMY TYPES
 */

/**
 * A node in the taxonomy tree
 */
export interface TaxonomyNode {
  /** Tier number (1-20) */
  tier: number;
  /** Node code */
  code: string;
  /** Node name */
  name: string;
  /** Full path from root */
  path: string[];
  /** Child nodes */
  children: TaxonomyNode[];
  /** Number of materials at or below this node */
  materialCount: number;
  /** Whether this is a leaf node */
  isLeaf: boolean;
  /** Description */
  description?: string;
}

/**
 * The complete taxonomy tree
 */
export interface TaxonomyTree {
  /** Root node */
  root: TaxonomyNode;
  /** Total number of nodes */
  totalNodes: number;
  /** Total number of materials */
  totalMaterials: number;
  /** Maximum depth (20 for full taxonomy) */
  maxDepth: number;
  /** When tree was built */
  builtAt: string;
}

/**
 * Navigation result with context
 */
export interface NavigationResult {
  /** Current node */
  currentNode: TaxonomyNode;
  /** Path from root to current */
  breadcrumb: TaxonomyNode[];
  /** Sibling nodes */
  siblings: TaxonomyNode[];
  /** Child nodes */
  children: TaxonomyNode[];
  /** Can navigate up */
  canGoUp: boolean;
  /** Can navigate down */
  canGoDown: boolean;
}

/**
 * Search result
 */
export interface TaxonomySearchResult {
  /** Matching node */
  node: TaxonomyNode;
  /** What matched (name or code) */
  matchType: 'name' | 'code' | 'both';
  /** Match score (higher is better) */
  score: number;
}

/**
 * Search options
 */
export interface TaxonomySearchOptions {
  /** Maximum results */
  limit?: number;
  /** Only search specific tier */
  tier?: number;
  /** Include leaf nodes */
  includeLeaves?: boolean;
  /** Case sensitive */
  caseSensitive?: boolean;
}
