import express from 'express';
import pg from 'pg'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString : process.env.DATABASE_URL
});

app.get('/users', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    }catch(error){
        next(error)
    }
})

app.post('/login', async (req, res, next) =>{
    const {username, password_hash} = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 1){
            const user = result.rows[0];
            const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);
            if (isPasswordValid){
                console.log('Login Successful')
                res.status(200).json({ message: 'Login Successful', user_id: user.user_id });
            } else {
                console.log('Authentication Failed')
                res.status(401).json({message: 'Authentication Failed'})
            }
        } else {
            console.log('User not found')
            res.status(404).json({ message: 'User not found'})
        }
    } catch (err){
        next (err)
    }
});

app.post('/register', async (req, res, next) => {
    const { username, password_hash, role } = req.body;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        const hash = await bcrypt.hash(password_hash, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
            [username, hash, role]
        );
        // Send a success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//change learn status true-------------------
app.get('/update-learned-true/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const { rows } = await pool.query('UPDATE flashcards SET learned = true WHERE id = $1 RETURNING*;', [id]);
      res.json(rows)
    } catch (error) {
      res.status(500).json({error})
      console.error(error)
    }
});
//change learn status false-------------------
app.get('/update-learned-false/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rows } = await pool.query('UPDATE flashcards SET learned = false WHERE id = $1 RETURNING*;', [id]);
    res.json(rows)
  } catch (error) {
    res.status(500).json({error})
    console.error(error)
  }
});
//post---------------
app.post('/flashcards', async (req, res) => {
    const { category_id, word, definition } = req.body;
  
    if (!category_id || !word || !definition) {
      return res.status(400).json('All fields required');
    }
  
    try {
      const { rows } = await pool.query(
        'INSERT INTO flashcards (category_id, word, definition, learned) VALUES ($1, $2, $3, $4) RETURNING *',
        [category_id, word, definition, false]
      );
  
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      console.error(error);
    }
  });
//put-----------------
app.put('/flashcards/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const {category_id, word, definition} = req.body;
  if(!category_id || !word || !definition){
    return res.status(400).json('All fields required')
  }
  try{
    const { rows } = await pool.query(
      'UPDATE flashcards SET (category_id, word, definition,) = ($1, $2, $3) WHERE id = $4 RETURNING *',
      [category_id, word, definition]
    );
  }catch(error){
    res.status(500).json({ error: 'Internal server error' });
    console.error(error);
  }
})
//delete---------------
app.delete('/flashcards/:id', async(req, res) => {
  const id = parseInt(req.params.id);
  try{
    const result = await pool.query('DELETE FROM flashcards WHERE id = $1 RETURNING * ',
    [id]
  );
  if (result.rows.length === 0){
      res.status(404).send('Unable to locate');
  } else {
      res.status(200).json(result.rows);
  };
  }catch(error){
    res.status(500).json({ error: 'Internal server error' });
    console.error(error);
  }
})
  //get all=========================
app.get('/flashcards', async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM flashcards ORDER BY id ASC;');
        res.json(rows)
    } catch (error) {
        res.json(error)
        console.log(error);
    }
});
//add 5 to progress===========
app.get('/progress/add-barheight', async (req, res) => {
  try {
      await pool.query('UPDATE progress SET barHeight = barHeight + 5;');
      const { rows } = await pool.query('SELECT * FROM progress;');
      res.json(rows);
  } catch (error) {
      res.status(500).json(error);
      console.log(error);
  }
});
//take 5 from progress-------------------
app.get('/progress/sub-barheight', async (req, res) => {
  try {
      await pool.query('UPDATE progress SET barHeight = barHeight - 5;');
      const { rows } = await pool.query('SELECT * FROM progress;');
      res.json(rows);
  } catch (error) {
      res.status(500).json(error);
      console.log(error);
  }
});
//=====================================
//get progress-----------------
app.get('/progress', async (req, res) => {
  try {
      const {rows} = await pool.query('SELECT barheight FROM progress;');
      res.json(rows)
  } catch (error) {
      res.json(error)
      console.log(error);
  }
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.type("text/plain");
    res.status(err.status || 500);
    res.send(err.message);
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`listening on Port ${port}`)
})