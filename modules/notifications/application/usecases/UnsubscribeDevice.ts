import PushSubscriptionRepository from "../../domain/repositories/PushSubscriptionRepository";

class UnsubscribeDevice {
  constructor(private subscriptionRepo: PushSubscriptionRepository) {}

  async execute(endpoint: string): Promise<void> {
    await this.subscriptionRepo.removeByEndpoint(endpoint);
  }
}

export default UnsubscribeDevice;
