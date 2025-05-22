import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vrvjozhwjnrxfxctsnxa.supabase.co'  // ← cambia esto
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZydmpvemh3am5yeGZ4Y3RzbnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODUzMDMsImV4cCI6MjA1OTk2MTMwM30.SFRlx4oOeaOdrNNN4HIDP283NaGt45EEQ7aHcDvTgVM'                    // ← cambia esto también

export const supabase = createClient(supabaseUrl, supabaseKey)
