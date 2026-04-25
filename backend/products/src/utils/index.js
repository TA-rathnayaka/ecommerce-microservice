import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import amqplib from 'amqplib';
// fixed: removed unused axios import

import {
  APP_SECRET,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
} from '../config/index.js';
// fixed: removed unused BASE_URL import

// Utility functions

// fixed: removed GenerateSalt — bcrypt handles salt internally
export const GeneratePassword = async (password) => {
  return await bcrypt.hash(password, 12); // 12 salt rounds
};

export const ValidatePassword = async (enteredPassword, savedPassword) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
  // fixed: was calling this.GeneratePassword() — `this` is undefined in ES modules
  // fixed: removed salt param — bcrypt.compare extracts salt from the hash itself
};

export const GenerateSignature = async (payload) => {
  try {
    return jwt.sign(payload, APP_SECRET, { expiresIn: '30d' });
    // fixed: jwt.sign is synchronous — await was unnecessary
  } catch (error) {
    console.error('Error generating signature:', error);
    throw new Error('Could not generate token');
    // fixed: was returning the error object — callers expected a string token
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
    // fixed: was assertQueue() — this was creating a queue named after the exchange
    // instead of creating the actual exchange
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

// fixed: removed PublishCustomerEvent and PublishShoppingEvent entirely
// these were HTTP-based event publishers replaced by RabbitMQ (PublishMessage)
// keeping dead code alongside the working implementation causes confusion