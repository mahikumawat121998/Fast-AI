import express from "express";
import cors from "cors";
import ImageKit from "imagekit";
import connection from "./connection.js";
import url, { fileURLToPath } from "url";
import path from "path";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { requireAuth, clerkMiddleware } from "@clerk/express";
import { userChat, getUserChat } from "./controllers/userChat.js";
import { getSingleChat, updateChat } from "./controllers/chat.js";
const port = process.env.PORT || 3000;
const app = express();
app.use(
  cors({
  origin: ['http://localhost:5173', 'http://192.168.1.11:5173','http://16.176.26.164:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Enable credentials if needed
  })
);
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// SDK initialization
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});
app.get("/api/test", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  console.log("Test request", userId);
  res.status(201).send(userId);
});
app.post("/api/chats", ClerkExpressRequireAuth(), userChat);
app.get("/api/userChats", ClerkExpressRequireAuth(), getUserChat);
app.get("/api/chats/:id", ClerkExpressRequireAuth(), getSingleChat);
app.put("/api/chats/:id", ClerkExpressRequireAuth(), updateChat);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});
// PRODUCTION
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(port, () => {
  connection();
  console.log(`Server is running on port ${port}`);
});
