import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabase } from './supabase.js';

const app = express();

// Basic middlewares
app.use(cors());
app.use(express.json());

// Allowed statuses for validation
export const ALLOWED_STATUSES = ['Masuk', 'Proses', 'Selesai', 'Diambil'];

// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, name: 'Shoe laundry ale', uptime: process.uptime() });
});

// GET /items?status=Selesai
app.get('/items', async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase.from('laundry_items').select('*').order('created_at', { ascending: false });
    if (status) {
      if (!ALLOWED_STATUSES.includes(String(status))) {
        return res.status(400).json({ error: 'Invalid status filter', allowed: ALLOWED_STATUSES });
      }
      query = query.eq('status', status);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json({ count: data?.length ?? 0, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items', details: String(err.message || err) });
  }
});

// GET /items/:id
app.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('laundry_items').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Item not found' });
    res.json(data);
  } catch (err) {
    const status = String(err?.message || '').includes('No rows') ? 404 : 500;
    res.status(status).json({ error: 'Failed to fetch item', details: String(err.message || err) });
  }
});

// POST /items
app.post('/items', async (req, res) => {
  try {
    const {
      customer_name,
      brand,
      color,
      service_type,
      price,
      received_at,
      due_at,
      notes,
      status = 'Masuk'
    } = req.body || {};

    if (!customer_name || !service_type) {
      return res.status(400).json({ error: 'customer_name and service_type are required' });
    }
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status', allowed: ALLOWED_STATUSES });
    }

    const payload = {
      customer_name,
      brand: brand ?? null,
      color: color ?? null,
      service_type,
      price: price ?? null,
      received_at: received_at ?? new Date().toISOString(),
      due_at: due_at ?? null,
      notes: notes ?? null,
      status
    };

    const { data, error } = await supabase.from('laundry_items').insert(payload).select('*').single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item', details: String(err.message || err) });
  }
});

// PUT /items/:id (full update) — if a field is omitted it becomes null (except required ones)
app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_name,
      brand,
      color,
      service_type,
      price,
      received_at,
      due_at,
      notes,
      status
    } = req.body || {};

    if (!customer_name || !service_type) {
      return res.status(400).json({ error: 'customer_name and service_type are required' });
    }
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status', allowed: ALLOWED_STATUSES });
    }

    const payload = {
      customer_name,
      brand: brand ?? null,
      color: color ?? null,
      service_type,
      price: price ?? null,
      received_at: received_at ?? null,
      due_at: due_at ?? null,
      notes: notes ?? null,
      status: status ?? null
    };

    const { data, error } = await supabase.from('laundry_items').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item', details: String(err.message || err) });
  }
});

// PATCH /items/:id — partial update (only included fields are changed)
app.patch('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body || {};
    if (changes.status && !ALLOWED_STATUSES.includes(changes.status)) {
      return res.status(400).json({ error: 'Invalid status', allowed: ALLOWED_STATUSES });
    }
    const { data, error } = await supabase.from('laundry_items').update(changes).eq('id', id).select('*').single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to patch item', details: String(err.message || err) });
  }
});

// DELETE /items/:id
app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('laundry_items').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item', details: String(err.message || err) });
  }
});

export default app;
