import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  id: string
  email: string
  name?: string
  username?: string
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name?: string; username?: string }
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      username: decoded.username
    }
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  )
}
