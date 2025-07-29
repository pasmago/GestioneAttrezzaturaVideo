import {
  users,
  equipment,
  transactions,
  maintenance,
  auditLog,
  type User,
  type UpsertUser,
  type Equipment,
  type InsertEquipment,
  type Transaction,
  type InsertTransaction,
  type Maintenance,
  type InsertMaintenance,
  type AuditLog,
  type InsertAuditLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Equipment operations
  getAllEquipment(): Promise<Equipment[]>;
  getEquipmentById(id: string): Promise<Equipment | undefined>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: string, equipment: Partial<InsertEquipment>): Promise<Equipment>;
  deleteEquipment(id: string): Promise<void>;
  searchEquipment(query: string, category?: string): Promise<Equipment[]>;
  getEquipmentStats(): Promise<{ total: number; available: number; inUse: number; maintenance: number }>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByEquipment(equipmentId: string): Promise<Transaction[]>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  getRecentTransactions(limit?: number): Promise<(Transaction & { equipment: Equipment; user: User })[]>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction>;
  deleteTransaction(id: string, deletedBy: string): Promise<void>;
  
  // Maintenance operations
  createMaintenance(maintenance: InsertMaintenance): Promise<Maintenance>;
  getMaintenanceByEquipment(equipmentId: string): Promise<Maintenance[]>;
  getUpcomingMaintenance(): Promise<(Maintenance & { equipment: Equipment })[]>;
  updateMaintenance(id: string, maintenance: Partial<InsertMaintenance>): Promise<Maintenance>;
  
  // Audit log operations
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<(AuditLog & { user: User })[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Equipment operations
  async getAllEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment).orderBy(equipment.name);
  }

  async getEquipmentById(id: string): Promise<Equipment | undefined> {
    const [item] = await db.select().from(equipment).where(eq(equipment.id, id));
    return item;
  }

  async createEquipment(equipmentData: InsertEquipment): Promise<Equipment> {
    const [item] = await db.insert(equipment).values(equipmentData).returning();
    return item;
  }

  async updateEquipment(id: string, equipmentData: Partial<InsertEquipment>): Promise<Equipment> {
    const [item] = await db
      .update(equipment)
      .set({ ...equipmentData, updatedAt: new Date() })
      .where(eq(equipment.id, id))
      .returning();
    return item;
  }

  async deleteEquipment(id: string): Promise<void> {
    await db.delete(equipment).where(eq(equipment.id, id));
  }

  async searchEquipment(query: string, category?: string): Promise<Equipment[]> {
    let whereClause = or(
      like(equipment.name, `%${query}%`),
      like(equipment.code, `%${query}%`),
      like(equipment.serialNumber, `%${query}%`)
    );

    if (category) {
      whereClause = and(whereClause, eq(equipment.category, category));
    }

    return await db.select().from(equipment).where(whereClause).orderBy(equipment.name);
  }

  async getEquipmentStats(): Promise<{ total: number; available: number; inUse: number; maintenance: number }> {
    const [stats] = await db
      .select({
        total: count(),
        available: sql<number>`COUNT(CASE WHEN status = 'available' THEN 1 END)`,
        inUse: sql<number>`COUNT(CASE WHEN status = 'in_use' THEN 1 END)`,
        maintenance: sql<number>`COUNT(CASE WHEN status = 'maintenance' THEN 1 END)`,
      })
      .from(equipment);
    
    return {
      total: Number(stats.total),
      available: Number(stats.available),
      inUse: Number(stats.inUse),
      maintenance: Number(stats.maintenance),
    };
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(transactionData).returning();
    return transaction;
  }

  async getTransactionsByEquipment(equipmentId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.equipmentId, equipmentId), eq(transactions.isDeleted, false)))
      .orderBy(desc(transactions.createdAt));
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.isDeleted, false)))
      .orderBy(desc(transactions.createdAt));
  }

  async getRecentTransactions(limit = 10): Promise<(Transaction & { equipment: Equipment; user: User })[]> {
    return await db
      .select()
      .from(transactions)
      .leftJoin(equipment, eq(transactions.equipmentId, equipment.id))
      .leftJoin(users, eq(transactions.userId, users.id))
      .where(eq(transactions.isDeleted, false))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async updateTransaction(id: string, transactionData: Partial<InsertTransaction>): Promise<Transaction> {
    const [transaction] = await db
      .update(transactions)
      .set(transactionData)
      .where(eq(transactions.id, id))
      .returning();
    return transaction;
  }

  async deleteTransaction(id: string, deletedBy: string): Promise<void> {
    await db
      .update(transactions)
      .set({
        isDeleted: true,
        deletedBy,
        deletedAt: new Date(),
      })
      .where(eq(transactions.id, id));
  }

  // Maintenance operations
  async createMaintenance(maintenanceData: InsertMaintenance): Promise<Maintenance> {
    const [maintenanceRecord] = await db.insert(maintenance).values(maintenanceData).returning();
    return maintenanceRecord;
  }

  async getMaintenanceByEquipment(equipmentId: string): Promise<Maintenance[]> {
    return await db
      .select()
      .from(maintenance)
      .where(eq(maintenance.equipmentId, equipmentId))
      .orderBy(desc(maintenance.scheduledDate));
  }

  async getUpcomingMaintenance(): Promise<(Maintenance & { equipment: Equipment })[]> {
    return await db
      .select()
      .from(maintenance)
      .leftJoin(equipment, eq(maintenance.equipmentId, equipment.id))
      .where(or(eq(maintenance.status, "scheduled"), eq(maintenance.status, "overdue")))
      .orderBy(maintenance.scheduledDate);
  }

  async updateMaintenance(id: string, maintenanceData: Partial<InsertMaintenance>): Promise<Maintenance> {
    const [maintenanceRecord] = await db
      .update(maintenance)
      .set({ ...maintenanceData, updatedAt: new Date() })
      .where(eq(maintenance.id, id))
      .returning();
    return maintenanceRecord;
  }

  // Audit log operations
  async createAuditLog(auditLogData: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db.insert(auditLog).values(auditLogData).returning();
    return log;
  }

  async getAuditLogs(limit = 50): Promise<(AuditLog & { user: User })[]> {
    return await db
      .select()
      .from(auditLog)
      .leftJoin(users, eq(auditLog.userId, users.id))
      .orderBy(desc(auditLog.timestamp))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
