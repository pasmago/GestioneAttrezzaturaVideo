import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertEquipmentSchema, 
  insertTransactionSchema, 
  insertMaintenanceSchema 
} from "@shared/schema";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

interface AuthenticatedRequest extends Request {
  user?: {
    claims: {
      sub: string;
      email?: string;
      first_name?: string;
      last_name?: string;
    };
  };
}

async function logAction(userId: string, action: string, entityType: string, entityId: string, oldData?: any, newData?: any, req?: Request) {
  await storage.createAuditLog({
    userId,
    action,
    entityType,
    entityId,
    oldData,
    newData,
    ipAddress: req?.ip,
    userAgent: req?.get('User-Agent'),
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Equipment routes
  app.get('/api/equipment', isAuthenticated, async (req: any, res: Response) => {
    try {
      const { search, category } = req.query;
      let equipment;
      
      if (search) {
        equipment = await storage.searchEquipment(search as string, category as string);
      } else {
        equipment = await storage.getAllEquipment();
      }
      
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.get('/api/equipment/stats', isAuthenticated, async (req: any, res: Response) => {
    try {
      const stats = await storage.getEquipmentStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching equipment stats:", error);
      res.status(500).json({ message: "Failed to fetch equipment stats" });
    }
  });

  app.get('/api/equipment/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const equipment = await storage.getEquipmentById(req.params.id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.post('/api/equipment', isAuthenticated, upload.single('image'), async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const equipmentData = insertEquipmentSchema.parse(req.body);
      
      if (req.file) {
        equipmentData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const equipment = await storage.createEquipment(equipmentData);
      
      await logAction(
        req.user.claims.sub,
        'CREATE',
        'equipment',
        equipment.id,
        null,
        equipment,
        req
      );

      res.status(201).json(equipment);
    } catch (error) {
      console.error("Error creating equipment:", error);
      res.status(500).json({ message: "Failed to create equipment" });
    }
  });

  app.put('/api/equipment/:id', isAuthenticated, upload.single('image'), async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const oldEquipment = await storage.getEquipmentById(req.params.id);
      if (!oldEquipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      const equipmentData = { ...req.body };
      
      if (req.file) {
        equipmentData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const equipment = await storage.updateEquipment(req.params.id, equipmentData);
      
      await logAction(
        req.user.claims.sub,
        'UPDATE',
        'equipment',
        equipment.id,
        oldEquipment,
        equipment,
        req
      );

      res.json(equipment);
    } catch (error) {
      console.error("Error updating equipment:", error);
      res.status(500).json({ message: "Failed to update equipment" });
    }
  });

  app.delete('/api/equipment/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const equipment = await storage.getEquipmentById(req.params.id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      await storage.deleteEquipment(req.params.id);
      
      await logAction(
        req.user.claims.sub,
        'DELETE',
        'equipment',
        req.params.id,
        equipment,
        null,
        req
      );

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting equipment:", error);
      res.status(500).json({ message: "Failed to delete equipment" });
    }
  });

  // Transaction routes
  app.post('/api/transactions/checkout', isAuthenticated, async (req: any, res: Response) => {
    try {
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
        type: 'checkout',
        checkoutTime: new Date(),
      });

      // Update equipment status
      await storage.updateEquipment(transactionData.equipmentId, {
        status: 'in_use',
        currentUserId: req.user.claims.sub,
      });

      const transaction = await storage.createTransaction(transactionData);
      
      await logAction(
        req.user.claims.sub,
        'CHECKOUT',
        'equipment',
        transactionData.equipmentId,
        null,
        transaction,
        req
      );

      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating checkout:", error);
      res.status(500).json({ message: "Failed to checkout equipment" });
    }
  });

  app.post('/api/transactions/checkin', isAuthenticated, async (req: any, res: Response) => {
    try {
      const { equipmentId, conditionOnReturn, notes } = req.body;
      const checkinTime = new Date();

      // Get the current checkout transaction
      const transactions = await storage.getTransactionsByEquipment(equipmentId);
      const checkoutTransaction = transactions.find(t => t.type === 'checkout' && !t.checkinTime);

      if (!checkoutTransaction) {
        return res.status(400).json({ message: "No active checkout found for this equipment" });
      }

      // Calculate usage hours
      const usageHours = Math.ceil(
        (checkinTime.getTime() - checkoutTransaction.checkoutTime!.getTime()) / (1000 * 60 * 60)
      );

      // Update the checkout transaction
      await storage.updateTransaction(checkoutTransaction.id, {
        checkinTime,
        usageHours,
        conditionOnReturn,
        notes,
      });

      // Update equipment status and total usage hours
      const equipment = await storage.getEquipmentById(equipmentId);
      await storage.updateEquipment(equipmentId, {
        status: 'available',
        currentUserId: null,
        totalUsageHours: (equipment?.totalUsageHours || 0) + usageHours,
      });

      await logAction(
        req.user.claims.sub,
        'CHECKIN',
        'equipment',
        equipmentId,
        null,
        { usageHours, conditionOnReturn },
        req
      );

      res.json({ message: "Equipment checked in successfully", usageHours });
    } catch (error) {
      console.error("Error checking in equipment:", error);
      res.status(500).json({ message: "Failed to checkin equipment" });
    }
  });

  app.get('/api/transactions/recent', isAuthenticated, async (req: any, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getRecentTransactions(limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      res.status(500).json({ message: "Failed to fetch recent transactions" });
    }
  });

  app.get('/api/transactions/user/:userId', isAuthenticated, async (req: any, res: Response) => {
    try {
      const transactions = await storage.getTransactionsByUser(req.params.userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      res.status(500).json({ message: "Failed to fetch user transactions" });
    }
  });

  app.delete('/api/transactions/:id', isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteTransaction(req.params.id, req.user.claims.sub);
      
      await logAction(
        req.user.claims.sub,
        'DELETE_TRANSACTION',
        'transaction',
        req.params.id,
        null,
        null,
        req
      );

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  // Maintenance routes
  app.get('/api/maintenance/upcoming', isAuthenticated, async (req: any, res: Response) => {
    try {
      const maintenance = await storage.getUpcomingMaintenance();
      res.json(maintenance);
    } catch (error) {
      console.error("Error fetching upcoming maintenance:", error);
      res.status(500).json({ message: "Failed to fetch upcoming maintenance" });
    }
  });

  app.post('/api/maintenance', isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const maintenanceData = insertMaintenanceSchema.parse(req.body);
      const maintenance = await storage.createMaintenance(maintenanceData);
      
      await logAction(
        req.user.claims.sub,
        'CREATE',
        'maintenance',
        maintenance.id,
        null,
        maintenance,
        req
      );

      res.status(201).json(maintenance);
    } catch (error) {
      console.error("Error creating maintenance:", error);
      res.status(500).json({ message: "Failed to create maintenance" });
    }
  });

  // Audit log routes (admin only)
  app.get('/api/audit-logs', isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // File upload route for images
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
