-- Create battery_storage table to persist battery data across sessions
CREATE TABLE IF NOT EXISTS public.battery_storage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_capacity FLOAT NOT NULL DEFAULT 0, -- Current stored energy in watts
  max_capacity FLOAT NOT NULL DEFAULT 10000, -- Maximum storage capacity in watts
  efficiency FLOAT NOT NULL DEFAULT 0.85, -- Battery charging efficiency (0-1)
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Last time battery was updated
  is_charging BOOLEAN NOT NULL DEFAULT FALSE, -- Whether the battery is currently charging
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies to only allow users to see their own battery data
ALTER TABLE public.battery_storage ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select only their own battery data
CREATE POLICY battery_select ON public.battery_storage
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own battery data 
CREATE POLICY battery_insert ON public.battery_storage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update only their own battery data
CREATE POLICY battery_update ON public.battery_storage
  FOR UPDATE USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_battery_storage_user_id ON public.battery_storage (user_id);

-- Add comment to table
COMMENT ON TABLE public.battery_storage IS 'Stores battery data for users to persist across sessions';