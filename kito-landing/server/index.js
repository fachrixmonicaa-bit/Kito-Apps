import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/db/index.js';
import { property, lead, article, survey, offer, expense, listing, user } from './src/db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './src/lib/auth.js';

dotenv.config();

const app = express();
// Force port 5000 to avoid conflicts with Coolify's default env variables
const PORT = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the React frontend build
// In Docker, __dirname is /app and dist is /app/dist
app.use(express.static(path.join(__dirname, 'dist')));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// ====== AUTH ======

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    const [foundUser] = await db.select().from(user).where(eq(user.email, email.toLowerCase().trim()));
    if (!foundUser) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    const isValid = await verifyPassword(password, foundUser.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    const token = generateToken(foundUser);
    const { password: _, ...userWithoutPassword } = foundUser;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me — validate token & return current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token tidak ditemukan.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Token tidak valid atau sudah expired.' });
    }

    const [foundUser] = await db.select().from(user).where(eq(user.id, decoded.id));
    if (!foundUser) {
      return res.status(401).json({ error: 'User tidak ditemukan.' });
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Auth/me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/register — create new user (admin only in production)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'agent' } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, dan nama wajib diisi.' });
    }

    const [existing] = await db.select().from(user).where(eq(user.email, email.toLowerCase().trim()));
    if (existing) {
      return res.status(409).json({ error: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await hashPassword(password);
    const [newUser] = await db.insert(user).values({
      email: email.toLowerCase().trim(),
      name,
      password: hashedPassword,
      role
    }).returning();

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/change-password
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token tidak ditemukan.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Token tidak valid.' });

    const { currentPassword, newPassword } = req.body;
    const [foundUser] = await db.select().from(user).where(eq(user.id, decoded.id));
    if (!foundUser) return res.status(404).json({ error: 'User tidak ditemukan.' });

    const isValid = await verifyPassword(currentPassword, foundUser.password);
    if (!isValid) return res.status(401).json({ error: 'Password lama salah.' });

    const hashedPassword = await hashPassword(newPassword);
    await db.update(user).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(user.id, decoded.id));

    res.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Example endpoint: Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await db.select().from(property);
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new property
app.post('/api/properties', async (req, res) => {
  try {
    const newProperty = req.body;
    const result = await db.insert(property).values(newProperty).returning();
    res.json(result[0]);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a property
app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    updatedData.updatedAt = new Date();
    const result = await db.update(property)
      .set(updatedData)
      .where(eq(property.id, Number(id)))
      .returning();
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a property
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(property).where(eq(property.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await db.select().from(lead);
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new lead
app.post('/api/leads', async (req, res) => {
  try {
    const newLead = req.body;
    const result = await db.insert(lead).values(newLead).returning();
    res.json(result[0]);
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a lead
app.put('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await db.update(lead)
      .set(updatedData)
      .where(eq(lead.id, Number(id)))
      .returning();
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a lead
app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(lead).where(eq(lead.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ====== ARTICLES ======
app.get('/api/articles', async (req, res) => {
  try {
    const data = await db.select().from(article);
    res.json(data);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.post('/api/articles', async (req, res) => {
  try {
    const result = await db.insert(article).values(req.body).returning();
    res.json(result[0]);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.put('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.update(article).set(req.body).where(eq(article.id, Number(id))).returning();
    res.json(result[0]);
  } catch (error) { 
    console.error("PUT /api/articles/:id error:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
});
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(article).where(eq(article.id, Number(id)));
    res.json({ success: true });
  } catch (error) { 
    console.error("DELETE /api/articles/:id error:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
});

// ====== SURVEYS ======
app.get('/api/surveys', async (req, res) => {
  try {
    const data = await db.select().from(survey);
    res.json(data);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.post('/api/surveys', async (req, res) => {
  try {
    const result = await db.insert(survey).values(req.body).returning();
    res.json(result[0]);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.put('/api/surveys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.update(survey).set(req.body).where(eq(survey.id, Number(id))).returning();
    res.json(result[0]);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.delete('/api/surveys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(survey).where(eq(survey.id, Number(id)));
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});

// ====== OFFERS ======
app.get('/api/offers', async (req, res) => {
  try {
    const data = await db.select().from(offer);
    res.json(data);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.post('/api/offers', async (req, res) => {
  try {
    const result = await db.insert(offer).values(req.body).returning();
    res.json(result[0]);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.put('/api/offers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.update(offer).set(req.body).where(eq(offer.id, Number(id))).returning();
    res.json(result[0]);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.delete('/api/offers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(offer).where(eq(offer.id, Number(id)));
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});

// ====== EXPENSES ======
app.get('/api/expenses', async (req, res) => {
  try {
    const data = await db.select().from(expense);
    res.json(data);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.post('/api/expenses', async (req, res) => {
  try {
    const result = await db.insert(expense).values(req.body).returning();
    res.json(result[0]);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.update(expense).set(req.body).where(eq(expense.id, Number(id))).returning();
    res.json(result[0]);
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(expense).where(eq(expense.id, Number(id)));
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});

// ====== LISTINGS ======
app.get('/api/listings', async (req, res) => {
  try {
    const data = await db.select().from(listing);
    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});
app.post('/api/listings', async (req, res) => {
  try {
    const { propertyId, ...rest } = req.body;
    const result = await db.insert(listing).values({
      propertyId: propertyId ? Number(propertyId) : null,
      data: req.body
    }).returning();
    res.json(result[0]);
  } catch (error) { 
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});
app.put('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { propertyId, ...rest } = req.body;
    const result = await db.update(listing)
      .set({
        propertyId: propertyId ? Number(propertyId) : null,
        data: req.body
      })
      .where(eq(listing.id, Number(id)))
      .returning();
    res.json(result[0]);
  } catch (error) { 
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(listing).where(eq(listing.id, Number(id)));
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

// Handle React routing, return all other requests to React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[MONOLITH] Server is running on port ${PORT}`);
});
