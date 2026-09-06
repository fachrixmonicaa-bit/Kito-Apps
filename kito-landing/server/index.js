import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/db/index.js';
import { property, lead, article, survey, offer, expense, listing } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

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
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
});
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(article).where(eq(article.id, Number(id)));
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: "Internal server error" }); }
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
    const result = await db.insert(listing).values({ data: req.body }).returning();
    res.json(result[0]);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});
app.put('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.update(listing).set({ data: req.body }).where(eq(listing.id, Number(id))).returning();
    res.json(result[0]);
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(listing).where(eq(listing.id, Number(id)));
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

// Handle React routing, return all other requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[MONOLITH] Server is running on port ${PORT}`);
});
