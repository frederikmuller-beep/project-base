import assert from "node:assert/strict";
import test from "node:test";
import { csvCell, toCsv } from "../lib/csv.ts";

test("escapes quotes, commas and line breaks in CSV cells", () => {
  assert.equal(csvCell('Tungt, men "godt"\nigen'), '"Tungt, men ""godt""\nigen"');
});

test("neutralizes spreadsheet formulas from free-text feedback", () => {
  for (const value of ["=1+1", "+SUM(A1:A2)", "-2+3", "@IMPORT", "  =cmd"]) {
    assert.equal(csvCell(value).startsWith('"\''), true);
  }
});

test("creates an Excel-friendly UTF-8 CSV with CRLF rows", () => {
  const csv = toCsv(["tester_id", "note"], [["A1", "Alt klart"]]);
  assert.equal(csv.startsWith("\uFEFF"), true);
  assert.match(csv, /"tester_id","note"\r\n"A1","Alt klart"\r\n$/);
});
