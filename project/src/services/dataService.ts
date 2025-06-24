import { User, Product } from '../types';

// Mock database using localStorage for persistence
class DataService {
  private getStorageKey(type: string): string {
    return `crud_app_${type}`;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // Generic CRUD operations
  private getData<T>(type: string): T[] {
    const data = localStorage.getItem(this.getStorageKey(type));
    return data ? JSON.parse(data) : [];
  }

  private saveData<T>(type: string, data: T[]): void {
    localStorage.setItem(this.getStorageKey(type), JSON.stringify(data));
  }

  // CREATE
  create<T extends { id?: string; createdAt?: string; updatedAt?: string }>(
    type: string,
    item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): T {
    const data = this.getData<T>(type);
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp(),
    } as T;
    
    data.push(newItem);
    this.saveData(type, data);
    return newItem;
  }

  // READ
  getAll<T>(type: string): T[] {
    return this.getData<T>(type);
  }

  getById<T extends { id: string }>(type: string, id: string): T | undefined {
    const data = this.getData<T>(type);
    return data.find(item => item.id === id);
  }

  // UPDATE
  update<T extends { id: string; updatedAt?: string }>(
    type: string,
    id: string,
    updates: Partial<Omit<T, 'id' | 'createdAt'>>
  ): T | null {
    const data = this.getData<T>(type);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: this.getCurrentTimestamp(),
    } as T;
    
    this.saveData(type, data);
    return data[index];
  }

  // DELETE
  delete<T extends { id: string }>(type: string, id: string): boolean {
    const data = this.getData<T>(type);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    data.splice(index, 1);
    this.saveData(type, data);
    return true;
  }

  // Initialize with sample data
  initializeData(): void {
    if (!localStorage.getItem(this.getStorageKey('users'))) {
      const sampleUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
        { name: 'Jean Dupont', email: 'jean.dupont@email.com', role: 'Admin' },
        { name: 'Marie Martin', email: 'marie.martin@email.com', role: 'User' },
        { name: 'Pierre Bernard', email: 'pierre.bernard@email.com', role: 'Manager' },
      ];
      
      sampleUsers.forEach(user => this.create('users', user));
    }

    if (!localStorage.getItem(this.getStorageKey('products'))) {
      const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
        { name: 'Ordinateur Portable', description: 'HP EliteBook 840 G8', price: 1299.99, category: 'Informatique', stock: 15 },
        { name: 'Smartphone', description: 'Samsung Galaxy S23', price: 899.99, category: 'Téléphones', stock: 25 },
        { name: 'Casque Audio', description: 'Sony WH-1000XM4', price: 349.99, category: 'Audio', stock: 30 },
      ];
      
      sampleProducts.forEach(product => this.create('products', product));
    }
  }
}

export const dataService = new DataService();