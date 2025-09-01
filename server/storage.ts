import { type User, type InsertUser, type DownloadRequest, type InsertDownloadRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createDownloadRequest(request: InsertDownloadRequest): Promise<DownloadRequest>;
  getDownloadRequest(id: string): Promise<DownloadRequest | undefined>;
  updateDownloadRequestStatus(id: string, status: string): Promise<DownloadRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private downloadRequests: Map<string, DownloadRequest>;

  constructor() {
    this.users = new Map();
    this.downloadRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDownloadRequest(insertRequest: InsertDownloadRequest): Promise<DownloadRequest> {
    const id = randomUUID();
    const request: DownloadRequest = {
      ...insertRequest,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.downloadRequests.set(id, request);
    return request;
  }

  async getDownloadRequest(id: string): Promise<DownloadRequest | undefined> {
    return this.downloadRequests.get(id);
  }

  async updateDownloadRequestStatus(id: string, status: string): Promise<DownloadRequest | undefined> {
    const request = this.downloadRequests.get(id);
    if (request) {
      request.status = status;
      this.downloadRequests.set(id, request);
      return request;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
