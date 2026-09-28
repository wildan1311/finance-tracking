import ReminderLogRepository from "@/modules/notifications/domain/repositories/ReminderLogRepository";
import JsonFileStore from "../storage/JsonFileStore";

const FILE = "reminder-log.json";

interface ReminderLogEntry {
  dayKey: string;
  sentAt: string;
  recipients: number;
}

class JsonReminderLogRepository implements ReminderLogRepository {
  constructor(private store: JsonFileStore = new JsonFileStore()) {}

  async wasSentOn(dayKey: string): Promise<boolean> {
    const entries = await this.store.read<ReminderLogEntry[]>(FILE, []);
    return entries.some((entry) => entry.dayKey === dayKey);
  }

  async markSent(dayKey: string, recipients: number): Promise<void> {
    await this.store.update<ReminderLogEntry[]>(
      FILE,
      (current) => [...current, { dayKey, sentAt: new Date().toISOString(), recipients }],
      [],
    );
  }
}

export default JsonReminderLogRepository;
