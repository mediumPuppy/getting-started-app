require('dotenv').config();
// database creds
const DB_HOST = process.env.RDS_HOSTNAME;
const DB_NAME = process.env.RDS_DB_NAME;
const DB_USER = process.env.RDS_USERNAME;
const DB_PASS = process.env.RDS_PASSWORD;
const DB_PORT = process.env.RDS_PORT;
const PORT = process.env.PORT || 3000;


const express = require('express');
const Knex = require('knex');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const knex = Knex({
  client: 'mysql2',
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT
  },
  debug: true
});

let isAuthenticated = false;

app.get('/', (req, res) => res.render('login'));

app.get('/dashboard', async (req, res) => {
  if (!isAuthenticated) return res.redirect('/');
  
  try {
    const results = await knex.select('*').from('SalesOrdersExample.Customers');
    res.render('dashboard', { data: results });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Server Error ${err}`);
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  isAuthenticated = username === 'competition' && password === '123456';
  res.redirect(isAuthenticated ? '/dashboard' : '/');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
