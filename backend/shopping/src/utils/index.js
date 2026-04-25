// utils/index.js (shopping service)
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import amqplib from 'amqplib';

import {
  APP_SECRET,
  EXCHANGE_NAME,
  SHOPPING_SERVICE,
  MSG_QUEUE_URL,
} from '../config/index.js';

// fixed: removed GenerateSalt — bcrypt handles salt internally
export const GeneratePassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

export const ValidatePassword = async (enteredPassword, savedPassword) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
  // fixed: was calling this.GeneratePassword() — `this` is undefined in ES modules
  // fixed: removed salt param — bcrypt.compare extracts it from the hash
};

export const GenerateSignature = async (payload) => {
  try {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '30d' });
    // fixed: jwt.sign is synchronous — await was unnecessary
  } catch (error) {
    console.error('Error generating signature:', error);
    throw new Error('Could not generate token');
    // fixed: was returning the error object instead of throwing
  }
};

export const ValidateSignature = async (req) => {
  try {
    const signature = req.get('Authorization');
    if (!signature) return false;
    // fixed: was crashing with TypeError if Authorization header was missing
    const payload = jwt.verify(signature.split(' ')[1], APP_SECRET);
    // fixed: jwt.verify is synchronous — await was unnecessary
    req.user = payload;
    return true;
  } catch (error) {
    console.error('Invalid signature:', error);
    return false;
  }
};

export const FormateData = (data) => {
  if (data !== null && data !== undefined) {
    return { data };
  } else {
    throw new Error('Data Not found!');
  }
  // fixed: was checking if(data) which throws on valid falsy values like 0 or false
};

// Message Broker

export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
    // fixed: was assertQueue() — was creating a queue instead of an exchange
    return channel;
  } catch (err) {
    console.error('Error creating RabbitMQ channel:', err);
    throw err;
  }
};

export const PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log('Sent: ', msg);
};

export const SubscribeMessage = async (channel, service) => {
  await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
  const q = await channel.assertQueue('', { exclusive: true });
  console.log(`Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, EXCHANGE_NAME, SHOPPING_SERVICE);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log('Message received:', msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log('[X] received');
    },
    { noAck: true }
  );
};