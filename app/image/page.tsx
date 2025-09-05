"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Download, Copy, Palette, Wand2, Brain, Settings, Eye, RefreshCw } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

const imageStyles = [
  { value: "realistic", label: "Realistic", description: "Photorealistic images" },
  { value: "artistic", label: "Artistic", description: "Artistic and creative styles" },
  { value: "minimalist", label: "Minimalist", description: "Clean and simple designs" },
  { value: "abstract", label: "Abstract", description: "Abstract and conceptual art" },
  { value: "vintage", label: "Vintage", description: "Retro and vintage aesthetics" },
  { value: "futuristic", label: "Futuristic", description: "Modern and sci-fi themes" },
]

const imageSizes = [
  { value: "512x512", label: "512×512", description: "Square format" },
  { value: "1024x1024", label: "1024×1024", description: "High-res square" },
  { value: "1024x768", label: "1024×768", description: "Landscape format" },
  { value: "768x1024", label: "768×1024", description: "Portrait format" },
  { value: "1920x1080", label: "1920×1080", description: "HD wallpaper" },
]

const imagePrompts = [
  {
    title: "Portrait",
    description: "Professional headshot style",
    prompt: "Professional portrait of a person, studio lighting, clean background, high quality"
  },
  {
    title: "Landscape",
    description: "Beautiful natural scenery",
    prompt: "Stunning landscape with mountains and lake, golden hour lighting, cinematic composition"
  },
  {
    title: "Abstract Art",
    description: "Modern abstract composition",
    prompt: "Abstract geometric composition, bold colors, modern art style, clean lines"
  },
  {
    title: "Product Shot",
    description: "Clean product photography",
    prompt: "Product photography, white background, professional lighting, commercial style"
  },
  {
    title: "Architecture",
    description: "Modern building design",
    prompt: "Modern architectural building, clean lines, minimalist design, professional photography"
  },
  {
    title: "Digital Art",
    description: "Fantasy digital artwork",
    prompt: "Fantasy digital art, magical atmosphere, vibrant colors, detailed illustration"
  }
]

export default function ImageLabPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("realistic")
  const [selectedSize, setSelectedSize] = useState("1024x1024")
  const [generatedImage, setGeneratedImage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are an expert image generator. Create detailed, high-quality images based on the user's prompt. Focus on visual appeal and artistic quality."
            },
            {
              role: "user",
              content: `Generate an image: ${prompt}. Style: ${selectedStyle}. Size: ${selectedSize}`
            }
          ],
          mode: "image"
        }),
      })

      const data = await response.json()
      if (data.response) {
        setGeneratedImage(data.response)
      }
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (generatedImage) {
      const a = document.createElement('a')
      a.href = generatedImage
      a.download = 'generated-image.png'
      a.click()
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground monospace">IMAGE LAB</h1>
              <p className="text-muted-foreground">AI-powered image generation and editing</p>
            </div>
          </div>
          <Badge variant="outline" className="text-accent border-accent">
            <Brain className="h-3 w-3 mr-1" />
            LLM7 Powered
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Edit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Image Generation
                  </CardTitle>
                  <CardDescription>
                    Describe the image you want to create
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image Description</label>
                    <Textarea
                      placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape at sunset')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Style</label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {imageStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Size</label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {imageSizes.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerateImage} 
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full button-minimal"
                  >
                    {isGenerating ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Generated Image
                    </div>
                    {generatedImage && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={downloadImage}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setGeneratedImage("")}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedSize} • {selectedStyle} style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedImage ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <img 
                          src={generatedImage} 
                          alt="Generated" 
                          className="w-full h-auto rounded border"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{selectedStyle}</Badge>
                        <Badge variant="outline">{selectedSize}</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border rounded">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Generated image will appear here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imagePrompts.map((template, index) => (
                <Card key={index} className="card-minimal cursor-pointer hover:border-foreground/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{template.prompt}</p>
                    <Button 
                      size="sm" 
                      className="w-full button-outline-minimal"
                      onClick={() => {
                        setPrompt(template.prompt)
                        setActiveTab("generate")
                      }}
                    >
                      Use Prompt
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Image Editing
                </CardTitle>
                <CardDescription>
                  Upload an image to get AI-powered editing suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Upload an image to edit</p>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  <Button className="w-full button-minimal" disabled>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Image (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
