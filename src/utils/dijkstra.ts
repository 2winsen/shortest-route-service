'use strict';

import { Graph, GraphNode } from 'src/types';

/******************************************************************************
 * Created 2008-08-19.
 *
 * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
 *
 * Copyright (C) 2008
 *   Wyatt Baldwin <self@wyattbaldwin.com>
 *   All rights reserved
 *
 * Licensed under the MIT license.
 *
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *****************************************************************************/
export const dijkstra = {
  single_source_shortest_paths: function (
    graph: Graph,
    s: GraphNode,
    d: GraphNode,
    maxNodes: number,
  ): [string[], number] {
    // Costs of shortest paths from s to all nodes encountered.
    // node ID => cost
    const costs = {};
    costs[s] = { cost: 0, path: s };
    const limitMaxNodes = maxNodes !== -1;

    // Costs of shortest paths from s to all nodes encountered; differs from
    // `costs` in that it provides easy access to the node that currently has
    // the known shortest path from s.
    // XXX: Do we actually need both `costs` and `open`?
    const open = new PriorityQueue();
    open.push(s, 0, s.toString());

    let closest;
    let u;
    let cost_of_s_to_u;
    let adjacent_nodes;
    let cost_of_e;
    let cost_of_s_to_u_plus_cost_of_e;
    let cost_of_s_to_v;
    let first_visit;
    let parentNodesKey = '';
    while (!open.empty()) {
      // In the nodes remaining in graph that have a known cost from s,
      // find the node, u, that currently has the shortest path from s.
      closest = open.pop();
      u = closest.value;
      parentNodesKey = closest.path;
      cost_of_s_to_u = closest.cost;

      // Get nodes adjacent to u...
      adjacent_nodes = graph[u] || {};

      // ...and explore the edges that connect u to those nodes, updating
      // the cost of the shortest paths to any or all of those nodes as
      // necessary. v is the node across the current edge from u.
      for (const v in adjacent_nodes) {
        if (adjacent_nodes.hasOwnProperty(v)) {
          const previousNodesKey = `${parentNodesKey}-${v}`;
          const previousNodesKeySize = previousNodesKey.split('-').length;
          if (limitMaxNodes && previousNodesKeySize > maxNodes) {
            continue;
          }
          // Get the cost of the edge running from u to v.
          cost_of_e = adjacent_nodes[v];

          // Cost of s to u plus the cost of u to v across e--this is *a*
          // cost from s to v that may or may not be less than the current
          // known cost to v.
          cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

          first_visit = costs[v] == null;
          cost_of_s_to_v = first_visit ? undefined : costs[v].cost;
          if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
            costs[v] = {
              cost: cost_of_s_to_u_plus_cost_of_e,
              path: previousNodesKey,
            };
            open.push(v, cost_of_s_to_u_plus_cost_of_e, previousNodesKey);
          }
        }
      }
    }

    const item = costs[d];
    if (typeof d !== 'undefined' && item == null) {
      const msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
      throw new Error(msg);
    }

    return [item.path.split('-'), item.cost];
  },

  find_path: function (
    graph: Graph,
    s: GraphNode,
    d: GraphNode,
    maxNodes = -1,
  ): [string[], number] {
    return dijkstra.single_source_shortest_paths(graph, s, d, maxNodes);
  },
};

interface PriorityQueueItem {
  value: GraphNode;
  cost: number;
  path: string;
}

class PriorityQueue {
  private queue: PriorityQueueItem[] = [];

  private defaultSorter(a: PriorityQueueItem, z: PriorityQueueItem) {
    return a.cost - z.cost;
  }

  /**
   * Add a new item to the queue and ensure the highest priority element
   * is at the front of the queue.
   */
  push(value: GraphNode, cost: number, path: string) {
    const item: PriorityQueueItem = { value: value, cost: cost, path: path };
    this.queue.push(item);
    this.queue.sort(this.defaultSorter);
  }

  /**
   * Return the highest priority element in the queue.
   */
  pop() {
    return this.queue.shift();
  }

  empty() {
    return this.queue.length === 0;
  }
}
