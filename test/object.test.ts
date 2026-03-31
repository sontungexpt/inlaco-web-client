import { keepChangedFields } from "@/utils/object";
import { describe, it, expect } from "vitest";

describe("keepChangedFields", () => {
  it("returns undefined when nothing changed", () => {
    expect(keepChangedFields("abc", "abc")).toBeUndefined();
  });

  it("detects primitive change", () => {
    expect(keepChangedFields("abc", "xyz")).toBe("xyz");
  });

  it("detects object diff", () => {
    const oldVal = { a: 1, b: 2 };
    const newVal = { a: 1, b: 3 };

    expect(keepChangedFields(oldVal, newVal)).toEqual({
      b: 3,
    });
  });

  it("returns null when field removed", () => {
    const oldVal = { a: 1 };
    const newVal = {} as any;

    expect(keepChangedFields(oldVal, newVal)).toEqual({
      a: null,
    });
  });

  it("handles nested diff", () => {
    const oldVal = { a: { x: 1, y: 2 } };
    const newVal = { a: { x: 1, y: 5 } };

    expect(keepChangedFields(oldVal, newVal)).toEqual({
      a: { y: 5 },
    });
  });

  it("returns undefined when no change in nested object", () => {
    const oldVal = { a: { x: 1 } };
    const newVal = { a: { x: 1 } };

    expect(keepChangedFields(oldVal, newVal)).toBeUndefined();
  });

  it("replaces array when changed", () => {
    expect(keepChangedFields([1, 2], [1, 3])).toEqual([1, 3]);
  });

  it("keeps array undefined if identical", () => {
    expect(keepChangedFields([1, 2], [1, 2])).toBeUndefined();
  });

  it("always replaces File", () => {
    const oldFile = new File(["a"], "a.txt");
    const newFile = new File(["b"], "b.txt");

    expect(keepChangedFields(oldFile, newFile)).toBe(newFile);
  });

  it("respects keepPaths (type)", () => {
    const result = keepChangedFields(
      { type: "A", name: "old" },
      { type: "B", name: "new" },
      { keepPaths: ["type"] },
    );

    expect(result).toEqual({
      type: "B",
      name: "new",
    });
  });

  it("respects nested keepPaths", () => {
    const result = keepChangedFields(
      { initiator: { type: "A", name: "old" } },
      { initiator: { type: "B", name: "old" } },
      { keepPaths: ["initiator.type"] },
    );

    expect(result).toEqual({
      initiator: {
        type: "B",
      },
    });
  });

  // it("respects array wildcard keepPaths", () => {
  //   const result = keepChangedFields(
  //     {
  //       partners: [
  //         { type: "A", name: "x" },
  //         { type: "A", name: "y" },
  //       ],
  //     },
  //     {
  //       partners: [
  //         { type: "B", name: "x" },
  //         { type: "C", name: "y" },
  //       ],
  //     },
  //     { keepPaths: ["partners[].type"] },
  //   );

  //   expect(result).toEqual({
  //     partners: [{ type: "B" }, { type: "C" }],
  //   });
  // });
});
