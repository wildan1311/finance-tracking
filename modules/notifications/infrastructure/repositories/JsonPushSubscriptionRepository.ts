import PushSubscription from "@/modules/notifications/domain/entities/PushSubscription";
import PushSubscriptionRepository from "@/modules/notifications/domain/repositories/PushSubscriptionRepository";
import JsonFileStore from "../storage/JsonFileStore";

const FILE = "push-subscriptions.json";

/**
 * Default store. See `JsonFileStore` for the serverless caveat.
 */
class JsonPushSubscriptionRepository implements PushSubscriptionRepository {
  constructor(private store: JsonFileStore = new JsonFileStore()) {}

  async findAll(): Promise<PushSubscription[]> {
    return this.store.read<PushSubscription[]>(FILE, []);
  }

  async save(subscription: PushSubscription): Promise<void> {
    await this.store.update<PushSubscription[]>(
      FILE,
      (current) => {
        const others = current.filter((item) => item.endpoint !== subscription.endpoint);
        return [...others, subscription];
      },
      [],
    );
  }

  async removeByEndpoint(endpoint: string): Promise<void> {
    await this.store.update<PushSubscription[]>(
      FILE,
      (current) => current.filter((item) => item.endpoint !== endpoint),
      [],
    );
  }

  async count(): Promise<number> {
    return (await this.findAll()).length;
  }
}

export default JsonPushSubscriptionRepository;
