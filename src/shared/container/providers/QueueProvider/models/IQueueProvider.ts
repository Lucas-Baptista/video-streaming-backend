export default interface IQueueProvider {
  connect(): Promise<void>;

  consume(
    queue: string,
    callback: (message: any) => Promise<void>
  ): Promise<void>;

  publish(queue: string, message: any): Promise<void>;
}
