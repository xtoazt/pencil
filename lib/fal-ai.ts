import { fal } from "@fal-ai/client"

// Configure fal.ai client
fal.config({
  credentials: process.env.FAL_KEY || "637fbb6c-b3f4-46b3-a1e3-b7063f336436:94a25907a5e020cbbd18f084cce05850"
})

export interface FalImageResult {
  url: string
  width: number
  height: number
  content_type: string
}

export interface FalGenerationResult {
  images: FalImageResult[]
  prompt: string
  seed: number
  has_nsfw_concepts: boolean[]
  timings: {
    inference: number
  }
}

export interface ImageGenerationOptions {
  prompt: string
  image_size?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number }
  num_inference_steps?: number
  seed?: number
  guidance_scale?: number
  sync_mode?: boolean
  num_images?: number
  enable_safety_checker?: boolean
  output_format?: "jpeg" | "png"
  acceleration?: "none" | "regular" | "high"
}

/**
 * Generate image using fal.ai FLUX.1 model
 */
export async function generateImageWithFal(options: ImageGenerationOptions): Promise<FalGenerationResult> {
  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: options.prompt,
        image_size: options.image_size || "landscape_4_3",
        num_inference_steps: options.num_inference_steps || 28,
        guidance_scale: options.guidance_scale || 3.5,
        num_images: options.num_images || 1,
        enable_safety_checker: options.enable_safety_checker !== false,
        output_format: options.output_format || "jpeg",
        acceleration: options.acceleration || "none",
        ...(options.seed && { seed: options.seed }),
        ...(options.sync_mode && { sync_mode: options.sync_mode })
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log)
        }
      },
    })

    return result.data
  } catch (error) {
    console.error("Fal.ai image generation error:", error)
    throw new Error(`Fal.ai generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate image with streaming support
 */
export async function generateImageWithFalStream(options: ImageGenerationOptions): Promise<FalGenerationResult> {
  try {
    const stream = await fal.stream("fal-ai/flux/dev", {
      input: {
        prompt: options.prompt,
        image_size: options.image_size || "landscape_4_3",
        num_inference_steps: options.num_inference_steps || 28,
        guidance_scale: options.guidance_scale || 3.5,
        num_images: options.num_images || 1,
        enable_safety_checker: options.enable_safety_checker !== false,
        output_format: options.output_format || "jpeg",
        acceleration: options.acceleration || "none",
        ...(options.seed && { seed: options.seed }),
        ...(options.sync_mode && { sync_mode: options.sync_mode })
      }
    })

    for await (const event of stream) {
      console.log("Stream event:", event)
    }

    const result = await stream.done()
    return result.data
  } catch (error) {
    console.error("Fal.ai streaming image generation error:", error)
    throw new Error(`Fal.ai streaming generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Convert image size string to fal.ai format
 */
export function convertImageSize(size: string, width?: number, height?: number): "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9" | { width: number; height: number } {
  if (width && height) {
    return { width, height }
  }

  switch (size.toLowerCase()) {
    case "square":
      return "square"
    case "square_hd":
      return "square_hd"
    case "portrait":
    case "portrait_4_3":
      return "portrait_4_3"
    case "portrait_16_9":
      return "portrait_16_9"
    case "landscape":
    case "landscape_4_3":
      return "landscape_4_3"
    case "landscape_16_9":
      return "landscape_16_9"
    default:
      return "landscape_4_3"
  }
}

/**
 * Enhanced image generation with fallback logic
 */
export async function generateImageWithFallback(
  prompt: string, 
  width = 512, 
  height = 512,
  style = "realistic"
): Promise<{
  url: string
  prompt: string
  width: number
  height: number
  model: string
  response?: string
  fallbackUsed?: boolean
}> {
  // First, try LLM7 image generation
  try {
    console.log("Attempting LLM7 image generation...")
    
    // Import LLM7 function dynamically to avoid circular dependencies
    const { generateImage: llm7GenerateImage } = await import("./llm7")
    const llm7Result = await llm7GenerateImage(prompt, width, height)
    
    // Check if LLM7 returned a real image (not placeholder)
    if (llm7Result.url && !llm7Result.url.includes("placeholder")) {
      console.log("LLM7 image generation successful")
      return {
        ...llm7Result,
        fallbackUsed: false
      }
    }
    
    // If LLM7 returned placeholder, it means image generation isn't working
    throw new Error("LLM7 returned placeholder - image generation not available")
    
  } catch (llm7Error) {
    console.log("LLM7 image generation failed, falling back to fal.ai:", llm7Error)
    
    // Fallback to fal.ai
    try {
      const imageSize = convertImageSize("custom", width, height)
      
      const falResult = await generateImageWithFal({
        prompt: `${prompt}, ${style} style, high quality, detailed`,
        image_size: imageSize,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
        output_format: "jpeg",
        acceleration: "regular" // Use regular acceleration for faster generation
      })
      
      if (falResult.images && falResult.images.length > 0) {
        const image = falResult.images[0]
        console.log("Fal.ai image generation successful")
        
        return {
          url: image.url,
          prompt: falResult.prompt,
          width: image.width,
          height: image.height,
          model: "flux-dev",
          fallbackUsed: true
        }
      }
      
      throw new Error("No images returned from fal.ai")
      
    } catch (falError) {
      console.error("Both LLM7 and fal.ai image generation failed:", falError)
      
      // Return error with details about both failures
      throw new Error(`Image generation failed. LLM7: ${llm7Error instanceof Error ? llm7Error.message : 'Unknown error'}. Fal.ai: ${falError instanceof Error ? falError.message : 'Unknown error'}`)
    }
  }
}
