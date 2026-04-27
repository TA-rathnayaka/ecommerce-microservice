import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import amqplib from 'amqplib';

import {
  APP_SECRET,
  EXCHANGE_NAME,
  CUSTOMER_SERVICE,
  MSG_QUEUE_URL,
} from '../config/index.js';

// Utility functions

// GenerateSalt removed — bcrypt.hash handles salt internally

export const GeneratePassword = async (password) => {
  return await bcrypt.hash(password, 12); // 12 salt rounds, no need for separate salt
};

export const ValidatePassword = async (enteredPassword, savedPassword) => {
  return await bcrypt.compare(enteredPassword, savedPassword); // salt is embedded in the hash
};

export const GenerateSignature = async (payload) => {
  try {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '30d' }); // jwt.sign is sync, no await needed
  } catch (error) {
    console.error('Error generating signature:', error);
    throw new Error('Could not generate token'); // throw instead of returning the error object
  }
};

export const ValidateSignature = async (req) => {
  try {
    const signature = req.get('Authorization');
    if (!signature) return false; // guard against missing header
    const payload = jwt.verify(signature.split(' ')[1], APP_SECRET); // jwt.verify is sync
    req.user = payload;
    return true;
  } catch (error) {
    console.error('Invalid signature:', error);
    return false;
  }
};

export const FormateData = (data) => {
  if (data !== null && data !== undefined) {
    return { data }; // fixed: previously threw on any falsy value (0, false, "")
  } else {
    throw new Error('Data Not found!');
  }
};

// Message Broker

export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true }); // fixed: was assertQueue which created a queue instead of an exchange
    return channel;
  } catch (err) {
    console.error('Error creating channel:', err);
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

  channel.bindQueue(q.queue, EXCHANGE_NAME, CUSTOMER_SERVICE);

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