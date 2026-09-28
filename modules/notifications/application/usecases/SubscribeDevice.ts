import PushSubscription from "../../domain/entities/PushSubscription";
import PushSubscriptionRepository from "../../domain/repositories/PushSubscriptionRepository";

class SubscribeDevice {
  constructor(
    private subscriptionRepo: PushSubscriptionRepository,
    private now: () => Date = () => new Date(),
  ) {}

  /**
   * Idempotent: re-subscribing with a known endpoint refreshes its keys
   * instead of creating a duplicate. This is also what keeps
   * `pushsubscriptionchange` from filling the store with dead entries.
   */
  async execute(subscription: PushSubscription): Promise<void> {
    const existing = (await this.subscriptionRepo.findAll()).some(
      (item) => item.endpoint === subscription.endpoint,
    );

    await this.subscriptionRepo.save(
      new PushSubscription(
        subscription.endpoint,
        subscription.p256dh,
        subscription.auth,
        existing ? subscription.createdAt : this.now().toISOString(),
      ),
    );
  }
}

export default SubscribeDevice;
