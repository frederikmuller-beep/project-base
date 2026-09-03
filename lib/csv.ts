export type CsvValue = string | number | boolean | null | undefined;

const spreadsheetFormulaPattern = /^[\t\r ]*[=+\-@]/;

export function csvCell(value: CsvValue) {
  let text = value === null || value === undefined ? "" : String(value);
  if (spreadsheetFormulaPattern.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function toCsv(headers: string[], rows: CsvValue[][]) {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) lines.push(row.map(csvCell).join(","));
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}
