import { createObjectCsvWriter } from "csv-writer";

export async function writeCsv(filepath, records) {
  if (!records.length) return;

  const header = Object.keys(records[0]).map((key) => ({ id: key, title: key }));
  const csvWriter = createObjectCsvWriter({
    path: filepath,
    header
  });

  await csvWriter.writeRecords(records);
}
