var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/vercel-storage.ts
var vercel_storage_exports = {};
__export(vercel_storage_exports, {
  getFromStorage: () => getFromStorage,
  removeFromStorage: () => removeFromStorage,
  saveToStorage: () => saveToStorage,
  serveImage: () => serveImage
});
import { v4 as uuidv4 } from "uuid";
async function saveToStorage(buffer, filename) {
  const id = filename || `${uuidv4()}.png`;
  memoryStorage[id] = buffer;
  return `/api/images/${id}`;
}
async function getFromStorage(id) {
  return memoryStorage[id] || null;
}
async function removeFromStorage(id) {
  if (memoryStorage[id]) {
    delete memoryStorage[id];
    return true;
  }
  return false;
}
async function serveImage(id) {
  const buffer = memoryStorage[id] || null;
  return {
    buffer,
    contentType: "image/png"
  };
}
var memoryStorage;
var init_vercel_storage = __esm({
  "server/vercel-storage.ts"() {
    "use strict";
    memoryStorage = {};
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  images: () => images,
  insertImageSchema: () => insertImageSchema,
  insertUserSchema: () => insertUserSchema,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  freeTrialUsed: boolean("free_trial_used").default(false).notNull(),
  processingCount: integer("processing_count").default(0).notNull(),
  subscriptionPlan: text("subscription_plan").default("free").notNull()
});
var images = pgTable("images", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originalUrl: text("original_url").notNull(),
  processedUrl: text("processed_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true
}).extend({
  processingCount: z.number().default(0)
});
var insertImageSchema = createInsertSchema(images).pick({
  userId: true,
  originalUrl: true,
  processedUrl: true
});

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var dbConnectionString = process.env.RAILWAY_DATABASE_URL;
if (!dbConnectionString) {
  throw new Error(
    "No database connection string found. Set either RAILWAY_DATABASE_URL or DATABASE_URL."
  );
}
var pool = new Pool({ connectionString: dbConnectionString });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";

// server/is-vercel.ts
function isVercel() {
  return process.env.VERCEL === "1";
}

// server/storage.ts
var MemoryStore = createMemoryStore(session);
var PostgresSessionStore = connectPg(session);
var MemStorage = class {
  users;
  images;
  sessionStore;
  // Using any type here to avoid SessionStore type issues
  currentUserId;
  currentImageId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.images = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentImageId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = {
      ...insertUser,
      id,
      email: insertUser.email || null,
      freeTrialUsed: false,
      processingCount: 0,
      subscriptionPlan: "free"
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, data) {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async markFreeTrialUsed(userId) {
    const user = await this.getUser(userId);
    if (user) {
      user.freeTrialUsed = true;
      this.users.set(userId, user);
    }
  }
  async incrementProcessingCount(userId) {
    const user = await this.getUser(userId);
    if (user) {
      user.processingCount += 1;
      this.users.set(userId, user);
    }
  }
  async saveImage(image) {
    const id = this.currentImageId++;
    const newImage = {
      id,
      userId: image.userId || null,
      originalUrl: image.originalUrl,
      processedUrl: image.processedUrl,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.images.set(id, newImage);
    return newImage;
  }
  async getUserImages(userId) {
    return Array.from(this.images.values()).filter((image) => image.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async getImage(id) {
    return this.images.get(id);
  }
};
var DatabaseStorage = class {
  sessionStore;
  // Using any type here to avoid SessionStore type issues
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values({
      ...insertUser,
      email: insertUser.email || null,
      freeTrialUsed: false,
      processingCount: 0,
      subscriptionPlan: "free"
    }).returning();
    return user;
  }
  async updateUser(id, data) {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }
  async markFreeTrialUsed(userId) {
    await db.update(users).set({ freeTrialUsed: true }).where(eq(users.id, userId));
  }
  async incrementProcessingCount(userId) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user) {
      await db.update(users).set({ processingCount: user.processingCount + 1 }).where(eq(users.id, userId));
    }
  }
  async saveImage(image) {
    const [savedImage] = await db.insert(images).values(image).returning();
    return savedImage;
  }
  async getUserImages(userId) {
    return await db.select().from(images).where(eq(images.userId, userId)).orderBy(desc(images.createdAt));
  }
  async getImage(id) {
    const [image] = await db.select().from(images).where(eq(images.id, id));
    return image || void 0;
  }
};
var storage = isVercel() || process.env.USE_DATABASE === "true" ? new DatabaseStorage() : new MemStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "removo-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 1 week
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    const { password, ...userWithoutPassword } = req.user;
    res.status(200).json(userWithoutPassword);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

// server/routes.ts
import multer from "multer";
import path2 from "path";
import fs2 from "fs";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname as dirname2 } from "path";

// server/image-processor.ts
init_vercel_storage();
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { v4 as uuidv42 } from "uuid";
import sharp from "sharp";
import fetch from "node-fetch";
import { FormData, Blob } from "node-fetch";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
if (!REMOVE_BG_API_KEY) {
  console.warn("Warning: REMOVE_BG_API_KEY not set. Background removal functionality will be limited.");
}
var uploadsDir = path.join(__dirname, "../uploads");
var originalDir = path.join(uploadsDir, "original");
var processedDir = path.join(uploadsDir, "processed");
async function ensureDirs() {
  try {
    await fs.mkdir(originalDir, { recursive: true });
    await fs.mkdir(processedDir, { recursive: true });
  } catch (error) {
    console.error("Error creating directories:", error);
  }
}
ensureDirs();
async function saveImage(imageBuffer) {
  if (isVercel()) {
    const filename = `original-${uuidv42()}.png`;
    return await saveToStorage(imageBuffer, filename);
  } else {
    const filename = `${uuidv42()}.png`;
    const filePath = path.join(originalDir, filename);
    await fs.writeFile(filePath, imageBuffer);
    return `/uploads/original/${filename}`;
  }
}
async function removeBackground(originalPath) {
  const filename = path.basename(originalPath);
  const outputFilename = `processed-${filename.replace("original-", "")}`;
  let imageBuffer;
  if (isVercel() && originalPath.startsWith("/api/images/")) {
    const imageId = originalPath.replace("/api/images/", "");
    const { getFromStorage: getFromStorage2 } = await Promise.resolve().then(() => (init_vercel_storage(), vercel_storage_exports));
    const buffer = await getFromStorage2(imageId);
    if (!buffer) {
      throw new Error("Image not found in storage");
    }
    imageBuffer = buffer;
  } else {
    const fullOriginalPath = path.join(__dirname, "..", originalPath);
    imageBuffer = await fs.readFile(fullOriginalPath);
  }
  const outputPath = path.join(processedDir, outputFilename);
  try {
    if (REMOVE_BG_API_KEY) {
      const formData = new FormData();
      formData.append("image_file", new Blob([imageBuffer]), "image.png");
      formData.append("size", "auto");
      formData.append("format", "png");
      formData.append("bg_color", "");
      console.log("Sending request to remove.bg API...");
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": REMOVE_BG_API_KEY
        },
        body: formData
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Remove.bg API error response:", errorBody);
        if (response.status === 402) {
          throw new Error("API usage limit reached. Please try again later.");
        } else {
          throw new Error(`Remove.bg API error: ${response.status} ${response.statusText}`);
        }
      }
      const processedImageBuffer = await response.buffer();
      console.log("Successfully processed image with remove.bg API");
      if (isVercel()) {
        const filename2 = `processed-${uuidv42()}.png`;
        return await saveToStorage(processedImageBuffer, filename2);
      } else {
        await fs.writeFile(outputPath, processedImageBuffer);
        return `/uploads/processed/${outputFilename}`;
      }
    } else {
      console.log("Using fallback background removal method");
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      const width = metadata.width || 500;
      const height = metadata.height || 500;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2;
      const circleSvg = Buffer.from(`
        <svg width="${width}" height="${height}">
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="white" />
        </svg>
      `);
      const processedImageBuffer = await image.composite([
        {
          input: circleSvg,
          blend: "dest-in"
        }
      ]).png().toBuffer();
      if (isVercel()) {
        const filename2 = `processed-${uuidv42()}.png`;
        return await saveToStorage(processedImageBuffer, filename2);
      } else {
        await fs.writeFile(outputPath, processedImageBuffer);
        return `/uploads/processed/${outputFilename}`;
      }
    }
  } catch (error) {
    console.error("Error removing background:", error);
    try {
      console.log("Falling back to simple background removal method");
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      const width = metadata.width || 500;
      const height = metadata.height || 500;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2;
      const circleSvg = Buffer.from(`
        <svg width="${width}" height="${height}">
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="white" />
        </svg>
      `);
      const processedImageBuffer = await image.composite([
        {
          input: circleSvg,
          blend: "dest-in"
        }
      ]).png().toBuffer();
      if (isVercel()) {
        const filename2 = `processed-${uuidv42()}.png`;
        return await saveToStorage(processedImageBuffer, filename2);
      } else {
        await fs.writeFile(outputPath, processedImageBuffer);
        return `/uploads/processed/${outputFilename}`;
      }
    } catch (fallbackError) {
      console.error("Fallback background removal also failed:", fallbackError);
      throw new Error("Background removal failed");
    }
  }
}
async function processImage(imageBuffer) {
  const originalUrl = await saveImage(imageBuffer);
  const processedUrl = await removeBackground(originalUrl);
  return {
    originalUrl,
    processedUrl
  };
}

// server/routes.ts
init_vercel_storage();
import express from "express";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  }
});
if (!isVercel()) {
  const uploadsDir2 = path2.join(__dirname2, "../uploads");
  try {
    if (!fs2.existsSync(uploadsDir2)) {
      fs2.mkdirSync(uploadsDir2, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
}
async function registerRoutes(app2) {
  setupAuth(app2);
  if (!isVercel()) {
    app2.use("/uploads", express.static(path2.join(__dirname2, "../uploads")));
  } else {
    app2.get("/api/images/:id", async (req, res) => {
      try {
        const { buffer, contentType } = await serveImage(req.params.id);
        if (!buffer) {
          return res.status(404).send("Image not found");
        }
        res.setHeader("Content-Type", contentType);
        res.send(buffer);
      } catch (error) {
        console.error("Error serving image:", error);
        res.status(500).send("Error serving image");
      }
    });
  }
  app2.post("/api/remove-background", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: "Only JPG, PNG, and WEBP files are allowed" });
      }
      let userId = null;
      if (req.isAuthenticated()) {
        userId = req.user?.id;
      }
      if (!req.isAuthenticated()) {
        const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
      } else {
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        if (user.subscriptionPlan === "free") {
          if (user.processingCount >= 2) {
            return res.status(403).json({
              error: "You've reached your limit of 2 free images. Please upgrade to a premium plan.",
              needsUpgrade: true
            });
          }
        } else if (user.subscriptionPlan === "premium") {
          if (user.processingCount >= 100) {
            return res.status(403).json({
              error: "You've reached your monthly limit of 100 images. Please upgrade to Business plan for unlimited processing.",
              needsUpgrade: true
            });
          }
        }
        await storage.incrementProcessingCount(userId);
      }
      const result = await processImage(req.file.buffer);
      if (userId) {
        await storage.saveImage({
          userId,
          originalUrl: result.originalUrl,
          processedUrl: result.processedUrl
        });
      }
      res.json({
        originalUrl: result.originalUrl,
        processedUrl: result.processedUrl
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ error: "Image processing failed" });
    }
  });
  app2.get("/api/user-images", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    try {
      const images2 = await storage.getUserImages(req.user.id);
      res.json(images2);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Failed to fetch image history" });
    }
  });
  app2.post("/api/update-subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    try {
      const { plan } = req.body;
      if (!plan || !["free", "premium", "business"].includes(plan)) {
        return res.status(400).json({ error: "Invalid subscription plan" });
      }
      const updatedUser = await storage.updateUser(req.user.id, { subscriptionPlan: plan });
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });
  if (isVercel()) {
    const indexPath = path2.join(__dirname2, "../public/index.html");
    app2.use("*", async (req, res, next) => {
      try {
        if (req.originalUrl.startsWith("/api")) {
          return next();
        }
        const publicPath = path2.join(__dirname2, "../public", req.originalUrl);
        if (fs2.existsSync(publicPath) && fs2.statSync(publicPath).isFile()) {
          return res.sendFile(publicPath);
        }
        res.sendFile(indexPath);
      } catch (error) {
        console.error("Error serving index.html:", error);
        next(error);
      }
    });
  }
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs3 from "fs";
import path4, { dirname as dirname4 } from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path3, { dirname as dirname3 } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath as fileURLToPath3 } from "url";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = dirname3(__filename3);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(__dirname3, "client", "src"),
      "@shared": path3.resolve(__dirname3, "shared"),
      "@assets": path3.resolve(__dirname3, "attached_assets")
    }
  },
  root: path3.resolve(__dirname3, "client"),
  build: {
    outDir: path3.resolve(__dirname3, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename4 = fileURLToPath4(import.meta.url);
var __dirname4 = dirname4(__filename4);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        __dirname4,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(__dirname4, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5012;
  server.listen({ port, host: "127.0.0.1" }, () => {
    log(`serving on port ${port}`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      log(`Port ${port} is in use. Try another port.`);
    } else {
      log(`Server error: ${err.message}`);
    }
    process.exit(1);
  });
})();
