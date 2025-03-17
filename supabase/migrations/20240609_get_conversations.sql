
-- Function to get the latest message from each conversation partner
CREATE OR REPLACE FUNCTION public.get_latest_conversations(current_user_id UUID)
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  recipient_id UUID,
  content TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMPTZ
) LANGUAGE SQL STABLE AS $$
  WITH conversation_partners AS (
    SELECT DISTINCT
      CASE
        WHEN sender_id = current_user_id THEN recipient_id
        ELSE sender_id
      END as partner_id
    FROM messages
    WHERE sender_id = current_user_id OR recipient_id = current_user_id
  ),
  latest_messages AS (
    SELECT DISTINCT ON (partner_id)
      m.id,
      m.sender_id,
      m.recipient_id,
      m.content,
      m.is_read,
      m.created_at,
      cp.partner_id
    FROM
      conversation_partners cp
    JOIN
      messages m ON (m.sender_id = cp.partner_id AND m.recipient_id = current_user_id)
      OR (m.sender_id = current_user_id AND m.recipient_id = cp.partner_id)
    ORDER BY
      cp.partner_id, m.created_at DESC
  )
  SELECT
    id, sender_id, recipient_id, content, is_read, created_at
  FROM
    latest_messages
  ORDER BY
    created_at DESC;
$$;
