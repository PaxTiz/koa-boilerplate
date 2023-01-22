import { tmpdir } from "os";
import { join } from "path";

export type Format = "json" | "csv" | "excel";

export abstract class Exporter<I> {
  protected items: Array<I>;
  protected format: Format;
  protected context: string | undefined;

  constructor(format: Format, items: Array<I>) {
    this.format = format;
    this.items = items;
  }

  async export(): Promise<{ path: string; filename: string }> {
    const { path, filename } = this._generateFilename();
    switch (this.format) {
      case "json":
        await this._buildJson(path);
      case "csv":
        await this._buildExcel(path);
      case "excel":
        await this._buildExcel(path);
    }

    return { path, filename };
  }

  _generateFilename(): { path: string; filename: string } {
    const date = new Date().getTime();
    const context = this.context ? `-${this.context}` : "";
    const extension = this.format === "excel" ? "xlsx" : this.format;
    const filename = `${date}-export${context}.${extension}`;
    const path = join(tmpdir(), filename);
    return { path, filename };
  }

  abstract _buildJson(path: string): Promise<void>;
  abstract _buildExcel(path: string): Promise<void>;
}
