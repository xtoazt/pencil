import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// User management functions
export async function createUserPreferences(userId: string) {
  return await sql`
    INSERT INTO user_preferences (user_id)
    VALUES (${userId})
    ON CONFLICT (user_id) DO NOTHING
    RETURNING *
  `
}

export async function getUserPreferences(userId: string) {
  const result = await sql`
    SELECT * FROM user_preferences WHERE user_id = ${userId}
  `
  return result[0] || null
}

// Conversation management functions
export async function createConversation(userId: string, title: string, mode = "chat") {
  const result = await sql`
    INSERT INTO conversations (user_id, title, mode)
    VALUES (${userId}, ${title}, ${mode})
    RETURNING *
  `
  return result[0]
}

export async function getUserConversations(userId: string) {
  return await sql`
    SELECT * FROM conversations 
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC
  `
}

export async function getConversation(conversationId: string, userId: string) {
  const result = await sql`
    SELECT * FROM conversations 
    WHERE id = ${conversationId} AND user_id = ${userId}
  `
  return result[0] || null
}

// Message management functions
export async function addMessage(conversationId: string, role: string, content: string, metadata: any = {}) {
  const result = await sql`
    INSERT INTO messages (conversation_id, role, content, metadata)
    VALUES (${conversationId}, ${role}, ${content}, ${JSON.stringify(metadata)})
    RETURNING *
  `

  // Update conversation timestamp
  await sql`
    UPDATE conversations 
    SET updated_at = NOW() 
    WHERE id = ${conversationId}
  `

  return result[0]
}

export async function getConversationMessages(conversationId: string) {
  return await sql`
    SELECT * FROM messages 
    WHERE conversation_id = ${conversationId}
    ORDER BY created_at ASC
  `
}

// Project management functions
export async function createProject(userId: string, name: string, description?: string, framework = "react") {
  const result = await sql`
    INSERT INTO projects (user_id, name, description, framework)
    VALUES (${userId}, ${name}, ${description}, ${framework})
    RETURNING *
  `
  return result[0]
}

export async function getUserProjects(userId: string) {
  return await sql`
    SELECT * FROM projects 
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC
  `
}

export async function updateProject(projectId: string, userId: string, updates: any) {
  const { name, description, code_content, framework } = updates
  const result = await sql`
    UPDATE projects 
    SET 
      name = COALESCE(${name}, name),
      description = COALESCE(${description}, description),
      code_content = COALESCE(${code_content}, code_content),
      framework = COALESCE(${framework}, framework),
      updated_at = NOW()
    WHERE id = ${projectId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0] || null
}
