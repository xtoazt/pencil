-- Create deployments table for OSS Mode
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_subdomain ON deployments(subdomain);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON deployments(created_at);

-- Add comments for documentation
COMMENT ON TABLE deployments IS 'Stores user deployments for OSS Mode with subdomain routing';
COMMENT ON COLUMN deployments.id IS 'Unique deployment identifier';
COMMENT ON COLUMN deployments.user_id IS 'ID of the user who created the deployment';
COMMENT ON COLUMN deployments.name IS 'Display name of the deployment';
COMMENT ON COLUMN deployments.description IS 'Optional description of the deployment';
COMMENT ON COLUMN deployments.framework IS 'Framework used (react, nextjs, fastapi, etc.)';
COMMENT ON COLUMN deployments.model_type IS 'Type of AI model (llm, image, code, etc.)';
COMMENT ON COLUMN deployments.status IS 'Current deployment status (building, deployed, failed, stopped)';
COMMENT ON COLUMN deployments.subdomain IS 'Unique subdomain for the deployment (pencilx.vercel.app/subdomain)';
COMMENT ON COLUMN deployments.url IS 'Full URL of the deployed application';
COMMENT ON COLUMN deployments.deployment_config IS 'JSON configuration for deployment settings';
COMMENT ON COLUMN deployments.build_logs IS 'JSON array of build log messages';
COMMENT ON COLUMN deployments.created_at IS 'Timestamp when deployment was created';
COMMENT ON COLUMN deployments.updated_at IS 'Timestamp when deployment was last updated';
