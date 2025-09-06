-- Create deployments table
CREATE TABLE IF NOT EXISTS deployments (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  framework VARCHAR(100) NOT NULL,
  model_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'building',
  subdomain VARCHAR(255) UNIQUE NOT NULL,
  url VARCHAR(500) NOT NULL,
  deployment_config JSONB DEFAULT '{}',
  build_logs JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_subdomain ON deployments(subdomain);

-- Add foreign key constraint if users table exists
-- ALTER TABLE deployments ADD CONSTRAINT fk_deployments_user_id 
-- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
