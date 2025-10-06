-- =====================================================
-- Message Threads Table Migration
-- =====================================================
-- This adds message threading functionality for better conversation organization
-- Run this after database-migration.sql and tour-migration.sql

-- 1. Create message_threads table
CREATE TABLE IF NOT EXISTS message_threads (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  participant_1 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_1_name TEXT,
  participant_2_name TEXT,
  last_message TEXT,
  last_message_time TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_thread UNIQUE(property_id, participant_1, participant_2)
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_message_threads_participant_1 ON message_threads(participant_1);
CREATE INDEX IF NOT EXISTS idx_message_threads_participant_2 ON message_threads(participant_2);
CREATE INDEX IF NOT EXISTS idx_message_threads_property ON message_threads(property_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_updated ON message_threads(updated_at DESC);

-- 3. Create updated_at trigger
DROP TRIGGER IF EXISTS update_message_threads_updated_at ON message_threads;
CREATE TRIGGER update_message_threads_updated_at 
  BEFORE UPDATE ON message_threads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable RLS
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
CREATE POLICY "Users can view their threads" ON message_threads 
  FOR SELECT USING (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );

CREATE POLICY "Users can create threads" ON message_threads 
  FOR INSERT WITH CHECK (
    auth.uid() = participant_1
  );

CREATE POLICY "Participants can update threads" ON message_threads 
  FOR UPDATE USING (
    auth.uid() = participant_1 OR auth.uid() = participant_2
  );

-- 6. Add thread_id to messages table for better organization
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS thread_id INTEGER REFERENCES message_threads(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);

-- 7. Create function to automatically create/update thread when message is sent
CREATE OR REPLACE FUNCTION handle_new_message()
RETURNS TRIGGER AS $$
DECLARE
  v_thread_id INTEGER;
  v_sender_name TEXT;
  v_recipient_name TEXT;
BEGIN
  -- Get sender and recipient names from profiles
  SELECT COALESCE(first_name || ' ' || last_name, username, email) INTO v_sender_name
  FROM profiles
  LEFT JOIN auth.users ON profiles.id = auth.users.id
  WHERE profiles.id = NEW.sender_id;
  
  SELECT COALESCE(first_name || ' ' || last_name, username, email) INTO v_recipient_name
  FROM profiles
  LEFT JOIN auth.users ON profiles.id = auth.users.id
  WHERE profiles.id = NEW.recipient_id;

  -- Check if thread exists
  SELECT id INTO v_thread_id
  FROM message_threads
  WHERE property_id IS NOT DISTINCT FROM NEW.property_id
    AND (
      (participant_1 = NEW.sender_id AND participant_2 = NEW.recipient_id) OR
      (participant_1 = NEW.recipient_id AND participant_2 = NEW.sender_id)
    );

  -- If thread doesn't exist, create it
  IF v_thread_id IS NULL THEN
    INSERT INTO message_threads (
      property_id,
      participant_1,
      participant_2,
      participant_1_name,
      participant_2_name,
      last_message,
      last_message_time
    ) VALUES (
      NEW.property_id,
      NEW.sender_id,
      NEW.recipient_id,
      v_sender_name,
      v_recipient_name,
      NEW.content,
      NEW.created_at
    )
    RETURNING id INTO v_thread_id;
  ELSE
    -- Update existing thread
    UPDATE message_threads
    SET last_message = NEW.content,
        last_message_time = NEW.created_at,
        updated_at = NEW.created_at
    WHERE id = v_thread_id;
  END IF;

  -- Set thread_id on the message
  NEW.thread_id = v_thread_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to handle messages
DROP TRIGGER IF EXISTS on_message_created ON messages;
CREATE TRIGGER on_message_created
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_message();

-- 9. Migrate existing messages to threads (if any exist)
INSERT INTO message_threads (
  property_id,
  participant_1,
  participant_2,
  participant_1_name,
  participant_2_name,
  last_message,
  last_message_time,
  created_at
)
SELECT DISTINCT ON (property_id, LEAST(sender_id, recipient_id), GREATEST(sender_id, recipient_id))
  m.property_id,
  LEAST(m.sender_id, m.recipient_id) as participant_1,
  GREATEST(m.sender_id, m.recipient_id) as participant_2,
  COALESCE(p1.first_name || ' ' || p1.last_name, p1.username, u1.email) as participant_1_name,
  COALESCE(p2.first_name || ' ' || p2.last_name, p2.username, u2.email) as participant_2_name,
  m.content as last_message,
  m.created_at as last_message_time,
  MIN(m.created_at) as created_at
FROM messages m
LEFT JOIN profiles p1 ON p1.id = LEAST(m.sender_id, m.recipient_id)
LEFT JOIN auth.users u1 ON u1.id = LEAST(m.sender_id, m.recipient_id)
LEFT JOIN profiles p2 ON p2.id = GREATEST(m.sender_id, m.recipient_id)
LEFT JOIN auth.users u2 ON u2.id = GREATEST(m.sender_id, m.recipient_id)
GROUP BY 
  m.property_id,
  LEAST(m.sender_id, m.recipient_id),
  GREATEST(m.sender_id, m.recipient_id),
  p1.first_name, p1.last_name, p1.username, u1.email,
  p2.first_name, p2.last_name, p2.username, u2.email,
  m.content,
  m.created_at
ORDER BY 
  m.property_id,
  LEAST(m.sender_id, m.recipient_id),
  GREATEST(m.sender_id, m.recipient_id),
  m.created_at DESC
ON CONFLICT (property_id, participant_1, participant_2) DO UPDATE
SET last_message = EXCLUDED.last_message,
    last_message_time = EXCLUDED.last_message_time
WHERE message_threads.last_message_time < EXCLUDED.last_message_time;

-- 10. Update existing messages with thread_id
UPDATE messages m
SET thread_id = mt.id
FROM message_threads mt
WHERE mt.property_id IS NOT DISTINCT FROM m.property_id
  AND (
    (mt.participant_1 = m.sender_id AND mt.participant_2 = m.recipient_id) OR
    (mt.participant_1 = m.recipient_id AND mt.participant_2 = m.sender_id)
  )
  AND m.thread_id IS NULL;

-- Verify the migration
SELECT 'Message threads migration complete!' AS status;
SELECT COUNT(*) AS total_threads FROM message_threads;
SELECT COUNT(*) AS messages_with_thread FROM messages WHERE thread_id IS NOT NULL;
SELECT COUNT(*) AS messages_without_thread FROM messages WHERE thread_id IS NULL;
