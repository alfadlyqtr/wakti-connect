
-- Create table for AI document context
CREATE TABLE IF NOT EXISTS public.ai_document_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for document context
ALTER TABLE public.ai_document_context ENABLE ROW LEVEL SECURITY;

-- Allow users to select only their own documents
CREATE POLICY "Users can view their own documents" 
  ON public.ai_document_context 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own documents
CREATE POLICY "Users can insert their own documents" 
  ON public.ai_document_context 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own documents
CREATE POLICY "Users can update their own documents" 
  ON public.ai_document_context 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents" 
  ON public.ai_document_context 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add new fields to ai_assistant_settings for enhanced personalization
ALTER TABLE public.ai_assistant_settings 
  ADD COLUMN IF NOT EXISTS user_role TEXT,
  ADD COLUMN IF NOT EXISTS assistant_mode TEXT,
  ADD COLUMN IF NOT EXISTS specialized_settings JSONB DEFAULT '{}'::jsonb;

-- Ensure appropriate indexes
CREATE INDEX IF NOT EXISTS idx_ai_document_context_user_id ON public.ai_document_context(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_assistant_settings_user_id_role_mode ON public.ai_assistant_settings(user_id, user_role, assistant_mode);

-- Create bucket for document processing
INSERT INTO storage.buckets (id, name, public)
VALUES ('ai-document-processing', 'AI Document Processing', false)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for the storage bucket
CREATE POLICY "Users can upload their own documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'ai-document-processing' AND (storage.foldername(name))[1] = 'temp');

-- Allow users to manage their own files
CREATE POLICY "Users can manage their temporary uploads"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'ai-document-processing' AND auth.uid()::text = (storage.foldername(name))[1]);
