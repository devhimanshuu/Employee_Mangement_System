const request = require('supertest');
const fs = require('fs');
const path = require('path');

const testDbPath = path.join(__dirname, 'employees.db');

beforeEach(() => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

afterEach(() => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

const app = require('./server');

describe('Employee API Tests', () => {
  
  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const newEmployee = {
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Software Engineer'
      };

      const response = await request(app)
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newEmployee.name);
      expect(response.body.email).toBe(newEmployee.email);
      expect(response.body.position).toBe(newEmployee.position);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidEmployee = {
        name: 'John Doe'
      };

      const response = await request(app)
        .post('/api/employees')
        .send(invalidEmployee)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidEmployee = {
        name: 'John Doe',
        email: 'invalid-email',
        position: 'Software Engineer'
      };

      const response = await request(app)
        .post('/api/employees')
        .send(invalidEmployee)
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
    });
  });

  describe('GET /api/employees', () => {
    it('should return all employees', async () => {
      const employees = [
        { name: 'John Doe', email: 'john@example.com', position: 'Developer' },
        { name: 'Jane Smith', email: 'jane@example.com', position: 'Manager' }
      ];

      for (const emp of employees) {
        await request(app)
          .post('/api/employees')
          .send(emp);
      }

      const response = await request(app)
        .get('/api/employees')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should search employees by name', async () => {
      await request(app)
        .post('/api/employees')
        .send({ name: 'John Doe', email: 'john@example.com', position: 'Developer' });
      
      await request(app)
        .post('/api/employees')
        .send({ name: 'Jane Smith', email: 'jane@example.com', position: 'Manager' });

      const response = await request(app)
        .get('/api/employees?search=John')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe('John Doe');
    });

    it('should search employees by email', async () => {
      await request(app)
        .post('/api/employees')
        .send({ name: 'John Doe', email: 'john@example.com', position: 'Developer' });
      
      await request(app)
        .post('/api/employees')
        .send({ name: 'Jane Smith', email: 'jane@example.com', position: 'Manager' });

      const response = await request(app)
        .get('/api/employees?search=jane@')
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].email).toBe('jane@example.com');
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .get('/api/employees/999')
        .expect(404);

      expect(response.body.error).toBe('Employee not found');
    });
  });

  describe('PUT /api/employees/:id', () => {

    it('should return 404 when updating non-existent employee', async () => {
      const updatedData = {
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Developer'
      };

      const response = await request(app)
        .put('/api/employees/999')
        .send(updatedData)
        .expect(404);

      expect(response.body.error).toBe('Employee not found');
    });

    it('should return 400 for missing required fields on update', async () => {
      const originalEmployee = {
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Developer'
      };

      const createResponse = await request(app)
        .post('/api/employees')
        .send(originalEmployee);

      const invalidUpdate = {
        name: 'John Doe'
      };

      const response = await request(app)
        .put(`/api/employees/${createResponse.body.id}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/employees/:id', () => {

    it('should return 404 when deleting non-existent employee', async () => {
      const response = await request(app)
        .delete('/api/employees/999')
        .expect(404);

      expect(response.body.error).toBe('Employee not found');
    });
  });

  describe('Input Validation Tests', () => {
    it('should validate email format correctly', async () => {
      const testCases = [
        { email: 'valid@example.com', shouldPass: true },
        { email: 'also.valid@example.co.uk', shouldPass: true },
        { email: 'invalid', shouldPass: false },
        { email: '@example.com', shouldPass: false },
        { email: 'user@', shouldPass: false },
        { email: 'user example@test.com', shouldPass: false }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/employees')
          .send({
            name: 'Test User',
            email: testCase.email,
            position: 'Tester'
          });

        if (testCase.shouldPass) {
          expect(response.status).toBe(201);
        } else {
          expect(response.status).toBe(400);
          expect(response.body.error).toBe('Invalid email format');
        }
      }
    });

    it('should handle empty string values', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          name: '',
          email: '',
          position: ''
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle whitespace-only values', async () => {
      const response = await request(app)
        .post('/api/employees')
        .send({
          name: '   ',
          email: '   ',
          position: '   '
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});