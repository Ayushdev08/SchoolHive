const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { Client } = require('pg');  // PostgreSQL client
const fs = require('fs');  // File system module

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Ensure the 'uploads/schoolImages/' directory exists
const uploadDir = path.join(__dirname, 'uploads', 'schoolImages');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });  // Create directory if it doesn't exist
  console.log('Created directory: uploads/schoolImages');
}

// Serve images correctly from 'uploads/schoolImages/' directory
app.use('/schoolImages', express.static(path.join(__dirname, 'uploads', 'schoolImages')));

// PostgreSQL database connection
const client = new Client({
  host: 'localhost',
  user: 'postgres',  // PostgreSQL username
  password: 'ayush08', // PostgreSQL password
  database: 'school_management', // Database name
  port: 5432, // Default PostgreSQL port
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Set up Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Set destination to 'uploads/schoolImages/'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with unique filename
  }
});
const upload = multer({ storage: storage });

// API to fetch all schools with filters, pagination
app.get('/api/schools', async (req, res) => {
  const { name, city, state, page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;

    // Adjust the SQL query to be more flexible for name, city, or state search
    const query = `
      SELECT * FROM schools
      WHERE ($1::text IS NULL OR name ILIKE $1)
        AND ($2::text IS NULL OR city ILIKE $2)
        AND ($3::text IS NULL OR state ILIKE $3)
      LIMIT $4 OFFSET $5;
    `;

    const values = [name || null, city || null, state || null, limit, offset];
    const result = await client.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching schools:', err);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

// API to fetch school details by ID
app.get('/api/schools/:id', async (req, res) => {
  const { id } = req.params;
  
  // Ensure that the ID is a number
  const schoolId = parseInt(id, 10);
  if (isNaN(schoolId)) {
    return res.status(400).json({ error: 'Invalid school ID' });
  }

  try {
    const result = await client.query('SELECT * FROM schools WHERE id = $1', [schoolId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'School not found' });
    }
  } catch (err) {
    console.error('Error fetching school details:', err);
    res.status(500).json({ error: 'Failed to fetch school details' });
  }
});

// API to add a new school
app.post('/api/schools', upload.single('image'), async (req, res) => {
  const { name, address, city, state, contact, email } = req.body;
  const image = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO schools (name, address, city, state, contact, email, image)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;
  
  const values = [name, address, city, state, contact, email, image];
  
  try {
    const result = await client.query(query, values);
    console.log('School added successfully:', result.rows[0]);
    res.status(201).json({ message: 'School added successfully', school: result.rows[0] });
  } catch (err) {
    console.error('Error inserting school:', err);
    res.status(500).json({ error: 'Failed to add school' });
  }
});

// API to update school details
app.put('/api/schools/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, address, city, state, contact, email } = req.body;
  const image = req.file ? req.file.filename : null;

  const query = `
    UPDATE schools
    SET name = $1, address = $2, city = $3, state = $4, contact = $5, email = $6, image = $7
    WHERE id = $8 RETURNING *;
  `;
  
  const values = [name, address, city, state, contact, email, image, id];
  
  try {
    const result = await client.query(query, values);
    if (result.rows.length > 0) {
      console.log('School updated successfully:', result.rows[0]);
      res.json({ message: 'School updated successfully', school: result.rows[0] });
    } else {
      res.status(404).json({ error: 'School not found' });
    }
  } catch (err) {
    console.error('Error updating school:', err);
    res.status(500).json({ error: 'Failed to update school' });
  }
});

// API to delete a school
app.delete('/api/schools/:id', async (req, res) => {
  const { id } = req.params;

  // Ensure that the ID is a number
  const schoolId = parseInt(id, 10);
  if (isNaN(schoolId)) {
    return res.status(400).json({ error: 'Invalid school ID' });
  }

  const query = 'DELETE FROM schools WHERE id = $1 RETURNING *;';
  
  try {
    const result = await client.query(query, [schoolId]);
    if (result.rows.length > 0) {
      console.log('School deleted successfully:', result.rows[0]);
      res.json({ message: 'School deleted successfully', school: result.rows[0] });
    } else {
      res.status(404).json({ error: 'School not found' });
    }
  } catch (err) {
    console.error('Error deleting school:', err);
    res.status(500).json({ error: 'Failed to delete school' });
  }
});

// New API to fetch school suggestions based on the search query
app.get('/api/schools/suggestions', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const result = await client.query(
      `SELECT id, name FROM schools 
       WHERE name ILIKE $1 OR city ILIKE $1 OR state ILIKE $1 
       LIMIT 10;`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching school suggestions:', err);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Start the server
app.listen(5001, () => {
  console.log('Server running on http://localhost:5001');
}); 
