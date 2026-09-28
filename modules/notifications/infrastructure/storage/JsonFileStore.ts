import { promises as fs } from "fs";
import path from "path";

/**
 * Tiny JSON file store used by the `PUSH_STORE=json` adapters.
 *
 * IMPORTANT: this writes to the local filesystem, which on Vercel is read-only
 * and reset on every deploy. It is the right default for local development and
 * a long-running Node host; for serverless use `PUSH_STORE=sheet` instead.
 *
 * Writes are serialised through a per-file promise chain so two concurrent
 * requests cannot interleave a read-modify-write and lose a subscription.
 */
class JsonFileStore {
  private locks = new Map<string, Promise<unknown>>();

  constructor(private readonly dir = path.join(process.cwd(), "data")) {}

  async read<T>(fileName: string, fallback: T): Promise<T> {
    const filePath = this.resolve(fileName);

    try {
      const raw = await fs.readFile(filePath, "utf8");
      return JSON.parse(raw) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
      if (error instanceof SyntaxError) {
        // A corrupt file should not brick the whole notifications feature.
        console.error(`[json-store] ${fileName} is corrupt, starting fresh`, error);
        return fallback;
      }
      throw error;
    }
  }

  async write<T>(fileName: string, data: T): Promise<void> {
    const filePath = this.resolve(fileName);

    await fs.mkdir(this.dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  }

  /** Read-modify-write under a per-file lock. */
  async update<T>(fileName: string, mutate: (current: T) => T, fallback: T): Promise<T> {
    const previous = this.locks.get(fileName) ?? Promise.resolve();

    const next = previous.then(async () => {
      const current = await this.read(fileName, fallback);
      const updated = mutate(current);
      await this.write(fileName, updated);
      return updated;
    });

    // Keep the chain alive even if this operation rejects.
    this.locks.set(
      fileName,
      next.catch(() => undefined),
    );

    return next;
  }

  private resolve(fileName: string): string {
    return path.join(this.dir, fileName);
  }
}

export default JsonFileStore;
