/**
 * A browser's push subscription as received from the Push API.
 *
 * This is a plain, JSON-safe value object. It must stay JSON-serialisable: it
 * travels over HTTP and is persisted as-is, so no `Date` or class instances.
 */
class PushSubscription {
  constructor(
    public endpoint: string,
    public p256dh: string,
    public auth: string,
    public createdAt: string = new Date().toISOString(),
  ) {}

  /** Parses the shape returned by `PushSubscription.toJSON()`. */
  static fromJson(json: PushSubscriptionJson): PushSubscription {
    return new PushSubscription(
      json.endpoint,
      json.keys.p256dh,
      json.keys.auth,
      json.createdAt ?? new Date().toISOString(),
    );
  }

  /** The `endpoint` is the natural key: it is unique per browser+profile. */
  get key(): string {
    return this.endpoint;
  }
}

export interface PushSubscriptionJson {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  expirationTime?: number | null;
  createdAt?: string;
}

export default PushSubscription;
