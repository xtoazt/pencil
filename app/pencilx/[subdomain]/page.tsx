import { notFound } from "next/navigation"
import { getSql } from "@/lib/database"

export const dynamic = 'force-dynamic'

interface Deployment {
  id: string
  name: string
  description: string
  framework: string
  modelType: string
  status: string
  subdomain: string
  url: string
  deploymentConfig: any
}

export default async function SubdomainPage({
  params
}: {
  params: { subdomain: string }
}) {
  try {
    const sql = getSql()
    
    // Find deployment by subdomain
    const deployments = await sql`
      SELECT * FROM deployments 
      WHERE subdomain = ${params.subdomain} AND status = 'deployed'
    `

    if (deployments.length === 0) {
      notFound()
    }

    const deployment = deployments[0] as Deployment

    // Render different interfaces based on model type
    if (deployment.modelType === 'llm') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {deployment.name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {deployment.description}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    🟢 Online
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {deployment.framework}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Chat with PencilGPT</h2>
                  <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50">
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-4">🤖</div>
                      <p>Chat interface will be loaded here</p>
                      <p className="text-sm mt-2">
                        This is a placeholder for the actual chat interface
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Model Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Framework:</span>
                        <span className="font-medium">{deployment.framework}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{deployment.modelType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">Deployed</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">API Endpoints</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chat API:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          /api/chat
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Health Check:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          /api/health
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (deployment.modelType === 'image') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {deployment.name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {deployment.description}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    🟢 Online
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Image Generation
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Generate Images with PencilGPT</h2>
                  <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50">
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-4">🎨</div>
                      <p>Image generation interface will be loaded here</p>
                      <p className="text-sm mt-2">
                        This is a placeholder for the actual image generation interface
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Default interface for other model types
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {deployment.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {deployment.description}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  🟢 Online
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {deployment.modelType}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🚀</div>
                <h2 className="text-xl font-semibold mb-2">PencilGPT Model Deployed</h2>
                <p className="text-gray-600 mb-4">
                  Your {deployment.modelType} model is successfully deployed and running.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Deployment Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Framework:</span>
                      <span className="ml-2 font-medium">{deployment.framework}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Model Type:</span>
                      <span className="ml-2 font-medium">{deployment.modelType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 font-medium text-green-600">Deployed</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Subdomain:</span>
                      <span className="ml-2 font-medium">{deployment.subdomain}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  } catch (error) {
    console.error("Error loading deployment:", error)
    notFound()
  }
}

// Removed generateStaticParams to make this page dynamic
// This prevents build-time database queries that fail when the table doesn't exist
