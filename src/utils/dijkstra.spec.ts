import { dijkstra } from './dijkstra';

describe(("dijkstra shortest path"), () => {
  it('should find the path between two points, all edges have weight 1', function () {
    // A B C
    // D E F
    // G H I
    const graph = {
      a: { b: 10, d: 1 },
      b: { a: 1, c: 1, e: 1 },
      c: { b: 1, f: 1 },
      d: { a: 1, e: 1, g: 1 },
      e: { b: 1, d: 1, f: 1, h: 1 },
      f: { c: 1, e: 1, i: 1 },
      g: { d: 1, h: 1 },
      h: { e: 1, g: 1, i: 1 },
      i: { f: 1, h: 1 }
    };
    const [path] = dijkstra.find_path(graph, 'a', 'i');
    expect(path).toEqual(['a', 'd', 'e', 'f', 'i']);
  });

  it('should find the path between two points, weighted edges', function () {
    const graph = {
      a: { b: 10, c: 100, d: 1 },
      b: { c: 10 },
      d: { b: 1, e: 1 },
      e: { f: 1 },
      f: { c: 1 },
      g: { b: 1 }
    };

    const [path1] = dijkstra.find_path(graph, 'a', 'c');
    expect(path1).toEqual(['a', 'd', 'e', 'f', 'c']);
    const [path2] = dijkstra.find_path(graph, 'd', 'b');
    expect(path2).toEqual(['d', 'b']);
  });

  it('should throw on unreachable destination', function () {
    const graph = {
      a: { b: 10, c: 100, d: 1 },
      b: { c: 10 },
      d: { b: 1, e: 1 },
      e: { f: 1 },
      f: { c: 1 },
      g: { b: 1 }
    };

    expect(function () { dijkstra.find_path(graph, 'c', 'a'); }).toThrow();
    expect(function () { dijkstra.find_path(graph, 'a', 'g'); }).toThrow();
  });

  it('should throw on non-existent destination', function () {
    const graph = {
      a: { b: 10, c: 100, d: 1 },
      b: { c: 10 },
      d: { b: 1, e: 1 },
      e: { f: 1 },
      f: { c: 1 },
      g: { b: 1 }
    };

    expect(function () { dijkstra.find_path(graph, 'a', 'z'); }).toThrow();
  });
});

describe(("dijkstra shortest path with maxEdges"), () => {
  it("shortest path [max 2 edges]", () => {
    const graph = {
      a: { b: 1, d: 15 },
      b: { c: 2 },
      c: { d: 3 },
    };
    const [path] = dijkstra.find_path(graph, 'a', 'd', 2);
    expect(path).toEqual(["a", "d"]);
  });

  it("shortest path [max 3 edges]", () => {
    const graph = {
      a: { b: 1, bb: 5 },
      b: { c: 2 },
      bb: { c: 2 },
    };
    const [path] = dijkstra.find_path(graph, 'a', 'c', 3);
    expect(path).toEqual(["a", "b", "c"]);
  });

  it("shortest path circular 2 nodes all interconnected", () => {
    const graph = {
      a: { b: 1 },
      b: { a: 1 },
    };
    const [path] = dijkstra.find_path(graph, 'a', 'b', -1);
    expect(path).toEqual(["a", "b"]);
  });

  it("shortest path circular 3 nodes all interconnected", () => {
    const graph = {
      a: { b: 1, c: 1 },
      b: { a: 1, c: 1 },
      c: { a: 1, b: 1 },
    };
    const [path] = dijkstra.find_path(graph, 'a', 'c', -1);
    expect(path).toEqual(["a", "c"]);
  });

  it("shortest path circular 3 nodes all interconnected a-b-c", () => {
    const graph = {
      a: { b: 1, c: 10 },
      b: { a: 1, c: 1 },
      c: { a: 1, b: 1 },
    };
    const [path] = dijkstra.find_path(graph, 'a', 'c', -1);
    expect(path).toEqual(["a", "b", "c"]);
  });

  it("shortest path circular 3 nodes all interconnected a-b-c [max 2 edges]", () => {
    const graph = {
      a: { b: 1, c: 10 },
      b: { a: 1, c: 1 },
      c: { a: 1, b: 1 },
    };
    const [path] = dijkstra.find_path(graph, 'a', 'c', 2);
    expect(path).toEqual(["a", "c"]);
  });

  it("shortest path circular", () => {
    const graph = {
      a: { b: 1, c: 1 },
      b: { a: 1, c: 1 },
    };
    const [path] = dijkstra.find_path(graph, 'a', 'c', -1);
    expect(path).toEqual(["a", "c"]);
  });

  it("shortest path through b", () => {
    const graph = {
      a: { b: 1 },
      b: { c: 1, d: 2 },
    };
    const [path] = dijkstra.find_path(graph, 'a', 'c', -1);
    expect(path).toEqual(["a", "b", "c"]);
  });

  it("shortest path through b numbers", () => {
    const graph = {
      100: { 200: 1 },
      200: { 300: 1, 400: 2 },
    };
    const [path] = dijkstra.find_path(graph, 100, 300, -1);
    expect(path).toEqual(["100", "200", "300"]);
  });
});