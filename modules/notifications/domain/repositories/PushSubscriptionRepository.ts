import PushSubscription from "../entities/PushSubscription";

/**
 * Port for persisting push subscriptions.
 *
 * Adapters: `JsonPushSubscriptionRepository` (default) and
 * `GoogleSheetPushSubscriptionRepository` (see `PUSH_STORE` env var).
 */
interface PushSubscriptionRepository {
  findAll(): Promise<PushSubscription[]>;
  /** Insert or update by `endpoint`. Subscriptions are re-sent on rotation. */
  save(subscription: PushSubscription): Promise<void>;
  removeByEndpoint(endpoint: string): Promise<void>;
  count(): Promise<number>;
}

export default PushSubscriptionRepository;
