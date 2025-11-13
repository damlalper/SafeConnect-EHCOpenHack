import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { openDB } from 'idb';

// Mock the idb library
vi.mock('idb', () => ({
  openDB: vi.fn(),
}));

describe('Database Functions', () => {
  let db;
  let mockDbInstance;

  beforeEach(async () => {
    // Create a fresh mock database instance for each test
    mockDbInstance = {
      put: vi.fn(),
      getAllFromIndex: vi.fn(),
    };

    // The mocked openDB function will resolve with our mock instance
    openDB.mockResolvedValue(mockDbInstance);
    
    // Reset modules to clear any cached dbPromise in db.js
    vi.resetModules();
    
    // Dynamically import the module to get a fresh instance for each test
    db = await import('./db');
    await db.initDB(); // Initialize with the mock
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('addMessage should call db.put with the correct arguments', async () => {
    const message = { id: '123', text: 'Hello', timestamp: Date.now() };
    await db.addMessage(message);

    // Check that the mock 'put' method was called correctly
    expect(mockDbInstance.put).toHaveBeenCalledWith('messages', message);
    expect(mockDbInstance.put).toHaveBeenCalledTimes(1);
  });

  it('getMessages should call db.getAllFromIndex and return the result', async () => {
    const messages = [
      { id: '123', text: 'Hello', timestamp: 1 },
      { id: '456', text: 'World', timestamp: 2 },
    ];
    // Setup the mock return value for this specific test
    mockDbInstance.getAllFromIndex.mockResolvedValue(messages);

    const result = await db.getMessages();

    // Check that the mock 'getAllFromIndex' method was called correctly
    expect(mockDbInstance.getAllFromIndex).toHaveBeenCalledWith('messages', 'timestamp');
    expect(mockDbInstance.getAllFromIndex).toHaveBeenCalledTimes(1);
    
    // Check that the function returned the mocked data
    expect(result).toEqual(messages);
  });
});
