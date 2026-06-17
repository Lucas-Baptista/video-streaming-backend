import amqp, { Channel } from 'amqplib';
import IQueueProvider from '../models/IQueueProvider';
import AppError from '../../../../errors/AppError';

export default class RabbitMQProvider implements IQueueProvider {
  private connection!: amqp.ChannelModel;

  private channel!: Channel;

  async connect(): Promise<void> {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL!);

    this.channel = await this.connection.createChannel();
  }

  private ensureConnection(): void {
    if (!this.connection || !this.channel) {
      throw new AppError(
        'RabbitMQ connection not initialized',
        500,
      );
    }
  }

  async consume(
    queue: string,
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    this.ensureConnection();

    await this.channel.assertQueue(queue, {
      durable: true,
    });

    await this.channel.prefetch(1);

    this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      const data = JSON.parse(
        msg.content.toString(),
      );

      try {
        console.log('[RABBIT] Mensagem recebida');

        await callback(data);

        this.channel.ack(msg);

        console.log('[RABBIT] ACK enviado');
      } catch (error) {
        console.error(error);

        this.channel.nack(
          msg,
          false,
          true,
        );
      }
    });
  }

  async publish(
    queue: string,
    message: any,
  ): Promise<void> {
    this.ensureConnection();

    await this.channel.assertQueue(queue, {
      durable: true,
    });

    this.channel.sendToQueue(
      queue,
      Buffer.from(
        JSON.stringify(message),
      ),
      {
        persistent: true,
      },
    );
  }
}
