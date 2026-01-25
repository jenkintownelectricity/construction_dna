/**
 * TAXONOMY NAVIGATOR
 *
 * Navigate and search the taxonomy tree
 */

import type { StorageAdapter } from '../storage';
import { TaxonomyTreeBuilder } from './tree';
import type {
  TaxonomyNode,
  TaxonomyTree,
  NavigationResult,
  TaxonomySearchResult,
  TaxonomySearchOptions,
} from './types';

/**
 * Navigation error
 */
export class NavigationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NavigationError';
  }
}

/**
 * Taxonomy navigator
 */
export class TaxonomyNavigator {
  private tree: TaxonomyTree | null = null;
  private treeBuilder: TaxonomyTreeBuilder;

  constructor(private storage: StorageAdapter) {
    this.treeBuilder = new TaxonomyTreeBuilder(storage);
  }

  /**
   * Get the taxonomy tree (cached)
   */
  async getTree(maxTier: number = 6): Promise<TaxonomyTree> {
    if (!this.tree || this.tree.maxDepth !== maxTier) {
      this.tree = await this.treeBuilder.buildTree(maxTier);
    }
    return this.tree;
  }

  /**
   * Invalidate the cached tree
   */
  invalidateCache(): void {
    this.tree = null;
  }

  /**
   * Navigate to a specific path
   */
  async navigateTo(path: string[]): Promise<NavigationResult> {
    const tree = await this.getTree();

    let current = tree.root;
    const breadcrumb: TaxonomyNode[] = [tree.root];

    for (const segment of path) {
      const child = current.children.find((c) => c.code === segment);
      if (!child) {
        throw new NavigationError(`Invalid path segment: ${segment}`);
      }
      current = child;
      breadcrumb.push(current);
    }

    // Find siblings
    const parent = breadcrumb[breadcrumb.length - 2] || tree.root;
    const siblings = parent.children.filter((c) => c.code !== current.code);

    return {
      currentNode: current,
      breadcrumb,
      siblings,
      children: current.children,
      canGoUp: path.length > 0,
      canGoDown: current.children.length > 0,
    };
  }

  /**
   * Navigate to a specific tier with optional parent path
   */
  async navigateToTier(tier: number, parentPath: string[] = []): Promise<TaxonomyNode[]> {
    const tree = await this.getTree(Math.max(tier, 6));
    const nodes: TaxonomyNode[] = [];

    const collect = (node: TaxonomyNode, currentPath: string[]): void => {
      // Check if within parent path
      const matchesPath = parentPath.every((segment, i) => currentPath[i] === segment);

      if (node.tier === tier && matchesPath) {
        nodes.push(node);
      } else if (node.tier < tier) {
        for (const child of node.children) {
          collect(child, [...currentPath, child.code]);
        }
      }
    };

    collect(tree.root, []);
    return nodes;
  }

  /**
   * Get children of a node at path
   */
  async getChildren(parentPath: string[]): Promise<TaxonomyNode[]> {
    const result = await this.navigateTo(parentPath);
    return result.children;
  }

  /**
   * Get a single node by path
   */
  async getNode(path: string[]): Promise<TaxonomyNode> {
    const result = await this.navigateTo(path);
    return result.currentNode;
  }

  /**
   * Search the taxonomy tree
   */
  async search(query: string, options?: TaxonomySearchOptions): Promise<TaxonomySearchResult[]> {
    const tree = await this.getTree();
    const results: TaxonomySearchResult[] = [];

    const queryLower = options?.caseSensitive ? query : query.toLowerCase();

    const searchNode = (node: TaxonomyNode): void => {
      // Skip leaves if not wanted
      if (node.isLeaf && options?.includeLeaves === false) {
        return;
      }

      // Skip if tier filter specified and doesn't match
      if (options?.tier !== undefined && node.tier !== options.tier) {
        // Continue to children
        for (const child of node.children) {
          searchNode(child);
        }
        return;
      }

      const nodeName = options?.caseSensitive ? node.name : node.name.toLowerCase();
      const nodeCode = options?.caseSensitive ? node.code : node.code.toLowerCase();

      const nameMatch = nodeName.includes(queryLower);
      const codeMatch = nodeCode.includes(queryLower);

      if (nameMatch || codeMatch) {
        let score = 0;

        // Exact matches score higher
        if (nodeName === queryLower || nodeCode === queryLower) {
          score += 10;
        }

        // Start-of-string matches score higher
        if (nodeName.startsWith(queryLower) || nodeCode.startsWith(queryLower)) {
          score += 5;
        }

        // Any match
        if (nameMatch) score += 2;
        if (codeMatch) score += 1;

        // More materials = more relevant
        score += Math.min(node.materialCount / 10, 3);

        results.push({
          node,
          matchType: nameMatch && codeMatch ? 'both' : nameMatch ? 'name' : 'code',
          score,
        });
      }

      // Recurse into children
      for (const child of node.children) {
        searchNode(child);
      }
    };

    searchNode(tree.root);

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Apply limit
    if (options?.limit) {
      return results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Get all nodes at a specific tier
   */
  async getNodesAtTier(tier: number): Promise<TaxonomyNode[]> {
    return this.navigateToTier(tier);
  }

  /**
   * Get the full path to a node as string
   */
  getPathString(node: TaxonomyNode, separator: string = ' > '): string {
    return node.path.join(separator);
  }

  /**
   * Find nodes containing materials with specific chemistry
   */
  async findByChemistry(chemistryCode: string): Promise<TaxonomyNode[]> {
    const materials = await this.storage.getAll();
    const matchingMaterials = materials.filter(
      (m) => m.physical.tier7_baseChemistry?.code === chemistryCode,
    );

    if (matchingMaterials.length === 0) {
      return [];
    }

    // Get unique paths
    const paths = new Set<string>();
    for (const m of matchingMaterials) {
      const path = [
        m.classification.tier1_division?.code,
        m.classification.tier2_category?.code,
        m.classification.tier3_assemblyType?.code,
        m.classification.tier4_condition?.code,
        m.classification.tier5_manufacturer?.code,
      ]
        .filter(Boolean)
        .join('/');
      paths.add(path);
    }

    // Navigate to each path and collect nodes
    const nodes: TaxonomyNode[] = [];
    for (const pathStr of paths) {
      try {
        const pathParts = pathStr.split('/');
        const result = await this.navigateTo(pathParts);
        nodes.push(result.currentNode);
      } catch {
        // Skip invalid paths
      }
    }

    return nodes;
  }

  /**
   * Get statistics about the taxonomy
   */
  async getStats(): Promise<TaxonomyStats> {
    const tree = await this.getTree();

    const stats: TaxonomyStats = {
      totalNodes: tree.totalNodes,
      totalMaterials: tree.totalMaterials,
      nodesByTier: {},
      materialsByTier: {},
    };

    const countByTier = (node: TaxonomyNode): void => {
      stats.nodesByTier[node.tier] = (stats.nodesByTier[node.tier] || 0) + 1;
      if (node.isLeaf) {
        stats.materialsByTier[node.tier] = (stats.materialsByTier[node.tier] || 0) + node.materialCount;
      }

      for (const child of node.children) {
        countByTier(child);
      }
    };

    countByTier(tree.root);

    return stats;
  }
}

export interface TaxonomyStats {
  totalNodes: number;
  totalMaterials: number;
  nodesByTier: Record<number, number>;
  materialsByTier: Record<number, number>;
}
