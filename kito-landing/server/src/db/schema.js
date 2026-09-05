import { pgTable, serial, varchar, text, doublePrecision, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const property = pgTable('Property', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 191 }).notNull(),
  description: text('description'),
  price: doublePrecision('price').notNull(),
  location: varchar('location', { length: 191 }),
  status: varchar('status', { length: 191 }).default('available').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const user = pgTable('User', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 191 }).unique().notNull(),
  name: varchar('name', { length: 191 }),
  password: varchar('password', { length: 191 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const lead = pgTable('Lead', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 191 }).notNull(),
  phone: varchar('phone', { length: 191 }),
  email: varchar('email', { length: 191 }),
  message: text('message'),
  propertyId: varchar('propertyId', { length: 191 }),
  status: varchar('status', { length: 191 }).default('New').notNull(),
  createdBy: varchar('createdBy', { length: 191 }).default('Unknown'),
  date: timestamp('date').defaultNow().notNull(),
});

export const article = pgTable('Article', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  category: varchar('category', { length: 191 }),
  status: varchar('status', { length: 50 }).default('Draft'),
  author: varchar('author', { length: 191 }),
  image: text('image'),
  tanggalInput: timestamp('tanggalInput').defaultNow().notNull(),
});

export const survey = pgTable('Survey', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 50 }).default('Scheduled'),
  date: timestamp('date').defaultNow().notNull(),
  data: jsonb('data')
});

export const offer = pgTable('Offer', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 50 }).default('Draft'),
  financeStatus: varchar('financeStatus', { length: 50 }).default('Pending'),
  createdBy: varchar('createdBy', { length: 191 }),
  date: timestamp('date').defaultNow().notNull(),
  data: jsonb('data')
});

export const expense = pgTable('Expense', {
  id: serial('id').primaryKey(),
  createdBy: varchar('createdBy', { length: 191 }),
  date: timestamp('date').defaultNow().notNull(),
  data: jsonb('data')
});

export const listing = pgTable('Listing', {
  id: serial('id').primaryKey(),
  tanggalInput: timestamp('tanggalInput').defaultNow().notNull(),
  data: jsonb('data')
});
