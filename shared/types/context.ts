// Imports the PrismaClient type
import { PrismaClient } from '@prisma/client'; 

// 1. Define the User type that your authentication middleware resolves
export interface AuthUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

// 2. Define the main context interface
export interface ResolverContext {
  // Authentication: Populated by your server middleware
  user: AuthUser | null; 
  
  // Data: The Prisma client instance
  prisma: PrismaClient; 
  
  // Optional: You could add your data loaders, services, etc.
}