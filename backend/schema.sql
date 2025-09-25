CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  time TEXT NOT NULL,
  avatar TEXT
);

CREATE TABLE quick_actions (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  icon TEXT,
  color TEXT
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'renter'
);
