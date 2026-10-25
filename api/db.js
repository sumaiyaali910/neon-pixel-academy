const fs = require('fs');
const path = require('path');

/**
 * Vercel Serverless & Node Database Endpoint (`api/db.js`)
 *
 * Manages the commercial Inventory & Campus Database:
 * - Teachers & Free/Busy Time Slots
 * - Indoor/Outdoor Game Zones & Seat Availability
 * - Campus Competitions & Events
 * - Student Extra-Class Bookings
 * - Competition Participant Registrations
 * - Game Arena Seat Reservations
 */

const SEED_PATH = path.join(__dirname, '..', 'data', 'database.json');
const TMP_DB_PATH = '/tmp/neon_pixel_academy_db.json';

function getDbPath() {
  // On Vercel, /tmp is writable; locally, write directly to data/database.json
  if (process.env.VERCEL) {
    if (!fs.existsSync(TMP_DB_PATH) && fs.existsSync(SEED_PATH)) {
      fs.copyFileSync(SEED_PATH, TMP_DB_PATH);
    }
    return TMP_DB_PATH;
  }
  return SEED_PATH;
}

function readDb() {
  try {
    const dbPath = getDbPath();
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading DB:', err);
  }
  return {
    teachers: [],
    gameZones: [],
    competitions: [],
    studentBookings: [],
    competitionParticipants: [],
    gameReservations: [],
  };
}

function writeDb(data) {
  try {
    const dbPath = getDbPath();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const db = readDb();
    return res.status(200).json(db);
  }

  if (req.method === 'POST') {
    try {
      const body =
        typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const { action, payload } = body;
      const db = readDb();

      if (action === 'sync_full_db' && payload) {
        writeDb(payload);
        return res.status(200).json({ ok: true, db: payload });
      }

      if (action === 'book_extra_class' && payload) {
        db.studentBookings.unshift(payload);
        const teacher = db.teachers.find((t) => t.id === payload.teacherId);
        if (teacher && Array.isArray(teacher.slots)) {
          const slot = teacher.slots.find((s) => s.time === payload.slotTime);
          if (slot) {
            slot.busy = true;
            slot.bookedBy = `${payload.studentName} (Extra Class)`;
          }
        }
        writeDb(db);
        return res.status(200).json({ ok: true, db });
      }

      if (action === 'register_participant' && payload) {
        db.competitionParticipants.unshift(payload);
        const comp = db.competitions.find((c) => c.id === payload.competitionId);
        if (comp) {
          comp.participants = (comp.participants || 0) + 1;
        }
        writeDb(db);
        return res.status(200).json({ ok: true, db });
      }

      if (action === 'reserve_game_seat' && payload) {
        db.gameReservations.unshift(payload);
        const zone = db.gameZones.find((z) => z.id === payload.zoneId);
        if (zone && Array.isArray(zone.slots)) {
          const slot = zone.slots.find((s) => s.id === payload.seatId);
          if (slot) {
            slot.occupied = true;
            slot.bookedBy = payload.studentName;
          }
        }
        writeDb(db);
        return res.status(200).json({ ok: true, db });
      }

      return res.status(400).json({ error: 'Unknown database action' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
