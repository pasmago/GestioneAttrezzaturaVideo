import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["admin", "operator"] }).notNull().default("operator"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const equipmentStatusEnum = pgEnum("equipment_status", ["available", "in_use", "maintenance", "damaged"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["checkout", "checkin"]);
export const maintenanceStatusEnum = pgEnum("maintenance_status", ["scheduled", "in_progress", "completed", "overdue"]);

export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  code: varchar("code").notNull().unique(),
  category: varchar("category").notNull(),
  serialNumber: varchar("serial_number"),
  description: text("description"),
  imageUrl: varchar("image_url"),
  purchaseDate: timestamp("purchase_date"),
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }),
  depreciationValue: decimal("depreciation_value", { precision: 10, scale: 2 }),
  condition: varchar("condition", { enum: ["excellent", "good", "fair", "poor"] }).default("excellent"),
  status: equipmentStatusEnum("status").notNull().default("available"),
  totalUsageHours: integer("total_usage_hours").default(0),
  currentUserId: varchar("current_user_id").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: varchar("equipment_id").notNull().references(() => equipment.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: transactionTypeEnum("type").notNull(),
  purpose: text("purpose"),
  checkoutTime: timestamp("checkout_time"),
  checkinTime: timestamp("checkin_time"),
  usageHours: integer("usage_hours"),
  signature: text("signature"),
  conditionOnReturn: varchar("condition_on_return"),
  notes: text("notes"),
  isDeleted: boolean("is_deleted").default(false),
  deletedBy: varchar("deleted_by").references(() => users.id),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const maintenance = pgTable("maintenance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: varchar("equipment_id").notNull().references(() => equipment.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  completedDate: timestamp("completed_date"),
  type: varchar("type").notNull(),
  description: text("description"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  technician: varchar("technician"),
  status: maintenanceStatusEnum("status").notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(),
  entityType: varchar("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  currentEquipment: many(equipment),
  auditLogs: many(auditLog),
}));

export const equipmentRelations = relations(equipment, ({ one, many }) => ({
  currentUser: one(users, {
    fields: [equipment.currentUserId],
    references: [users.id],
  }),
  transactions: many(transactions),
  maintenance: many(maintenance),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  equipment: one(equipment, {
    fields: [transactions.equipmentId],
    references: [equipment.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  deletedByUser: one(users, {
    fields: [transactions.deletedBy],
    references: [users.id],
  }),
}));

export const maintenanceRelations = relations(maintenance, ({ one }) => ({
  equipment: one(equipment, {
    fields: [maintenance.equipmentId],
    references: [equipment.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertMaintenanceSchema = createInsertSchema(maintenance).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLog).omit({
  id: true,
  timestamp: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Maintenance = typeof maintenance.$inferSelect;
export type InsertMaintenance = z.infer<typeof insertMaintenanceSchema>;
export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
