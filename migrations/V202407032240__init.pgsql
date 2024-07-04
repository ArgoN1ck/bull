CREATE TABLE IF NOT EXISTS users(
  id uuid PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  status boolean DEFAULT FALSE,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

