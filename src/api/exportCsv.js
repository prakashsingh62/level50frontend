export function exportCsv(rows) {
  const keys = Object.keys(rows[0] || {});
  const csv = [keys.join(",")]
    .concat(rows.map(r => keys.map(k => JSON.stringify(r[k] ?? "")).join(",")))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "export.csv";
  a.click();
}
