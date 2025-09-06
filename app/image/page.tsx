"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ImageIcon, Download, Copy, Palette, Wand2, Brain, Settings, Eye, RefreshCw, Loader2, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, FlipHorizontal, FlipVertical, Crop, Filter, Layers, Save, Share2, Heart, Bookmark, MoreHorizontal, Camera, Upload, Trash2, Edit3, Move, Maximize } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getAvailableModels, getModelsByCategory, getRecommendedModel } from "@/lib/llm7"

const imageStyles = [
  { value: "realistic", label: "Realistic", description: "Photorealistic images", icon: "📸" },
  { value: "artistic", label: "Artistic", description: "Artistic and creative styles", icon: "🎨" },
  { value: "minimalist", label: "Minimalist", description: "Clean and simple designs", icon: "⚪" },
  { value: "abstract", label: "Abstract", description: "Abstract and conceptual art", icon: "🌀" },
  { value: "vintage", label: "Vintage", description: "Retro and vintage aesthetics", icon: "📻" },
  { value: "futuristic", label: "Futuristic", description: "Modern and sci-fi themes", icon: "🚀" },
  { value: "anime", label: "Anime", description: "Anime and manga style", icon: "🎌" },
  { value: "cartoon", label: "Cartoon", description: "Cartoon and illustration style", icon: "🎭" },
]

const imageSizes = [
  { value: "512x512", label: "512×512", description: "Square format", aspect: "1:1" },
  { value: "1024x1024", label: "1024×1024", description: "High-res square", aspect: "1:1" },
  { value: "1024x768", label: "1024×768", description: "Landscape format", aspect: "4:3" },
  { value: "768x1024", label: "768×1024", description: "Portrait format", aspect: "3:4" },
  { value: "1920x1080", label: "1920×1080", description: "HD wallpaper", aspect: "16:9" },
  { value: "1080x1920", label: "1080×1920", description: "Mobile wallpaper", aspect: "9:16" },
  { value: "2048x2048", label: "2048×2048", description: "Ultra high-res", aspect: "1:1" },
]

const imagePrompts = [
  {
    title: "Portrait",
    description: "Professional headshot style",
    prompt: "Professional portrait of a person, studio lighting, clean background, high quality, detailed",
    style: "realistic",
    size: "1024x1024",
    icon: "👤"
  },
  {
    title: "Landscape",
    description: "Beautiful natural scenery",
    prompt: "Stunning landscape with mountains and lake, golden hour lighting, cinematic composition, photorealistic",
    style: "realistic",
    size: "1920x1080",
    icon: "🏔️"
  },
  {
    title: "Abstract Art",
    description: "Modern abstract composition",
    prompt: "Abstract geometric composition, bold colors, modern art style, clean lines, minimalist",
    style: "abstract",
    size: "1024x1024",
    icon: "🎨"
  },
  {
    title: "Product Shot",
    description: "Clean product photography",
    prompt: "Product photography, white background, professional lighting, commercial style, high quality",
    style: "realistic",
    size: "1024x1024",
    icon: "📦"
  },
  {
    title: "Architecture",
    description: "Modern building design",
    prompt: "Modern architectural building, clean lines, minimalist design, professional photography, golden hour",
    style: "realistic",
    size: "1920x1080",
    icon: "🏢"
  },
  {
    title: "Digital Art",
    description: "Fantasy digital artwork",
    prompt: "Fantasy digital art, magical atmosphere, vibrant colors, detailed illustration, concept art style",
    style: "artistic",
    size: "1024x1024",
    icon: "✨"
  },
  {
    title: "Anime Character",
    description: "Anime style character",
    prompt: "Anime character, detailed, high quality, vibrant colors, manga style, professional illustration",
    style: "anime",
    size: "1024x1024",
    icon: "🎌"
  },
  {
    title: "Logo Design",
    description: "Modern logo concept",
    prompt: "Modern logo design, minimalist, clean typography, professional, vector style, simple",
    style: "minimalist",
    size: "1024x1024",
    icon: "🔤"
  }
]

export default function ImageLabPage() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("realistic")
  const [selectedSize, setSelectedSize] = useState("1024x1024")
  const [selectedModel, setSelectedModel] = useState("pixtral-large")
  const [generatedImage, setGeneratedImage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")
  const [availableModels, setAvailableModels] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageHistory, setImageHistory] = useState([])
  const [zoomLevel, setZoomLevel] = useState(100)
  const [brightness, setBrightness] = useState(50)
  const [contrast, setContrast] = useState(50)
  const [saturation, setSaturation] = useState(50)
  const [showFilters, setShowFilters] = useState(false)
  const [favoriteImages, setFavoriteImages] = useState([])

  useEffect(() => {
    setAvailableModels(getAvailableModels())
  }, [])

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
          mode: "image",
          model: selectedModel
        }),
      })

      const data = await response.json()
      if (data.content) {
        setGeneratedImage(data.content)
        setImageHistory(prev => [...prev, {
          id: Date.now(),
          prompt,
          image: data.content,
          style: selectedStyle,
          size: selectedSize,
          model: selectedModel,
          timestamp: new Date()
        }])
      } else if (data.response) {
        setGeneratedImage(data.response)
        setImageHistory(prev => [...prev, {
          id: Date.now(),
          prompt,
          image: data.response,
          style: selectedStyle,
          size: selectedSize,
          model: selectedModel,
          timestamp: new Date()
        }])
      } else {
        console.error("No image content received from API:", data)
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
      a.download = `generated-image-${Date.now()}.png`
      a.click()
    }
  }

  const copyImageUrl = () => {
    if (generatedImage) {
      navigator.clipboard.writeText(generatedImage)
    }
  }

  const addToFavorites = () => {
    if (generatedImage) {
      setFavoriteImages(prev => [...prev, {
        id: Date.now(),
        image: generatedImage,
        prompt,
        timestamp: new Date()
      }])
    }
  }

  const getMultimodalModels = () => {
    return getModelsByCategory("Multimodal")
  }

  const getStyleIcon = (style: string) => {
    return imageStyles.find(s => s.value === style)?.icon || "🎨"
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-accent border-accent">
              <Brain className="h-3 w-3 mr-1" />
              {getMultimodalModels().length} Multimodal Models
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Prompts
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
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
                    <Label className="text-sm font-medium">Image Description</Label>
                    <Textarea
                      placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape at sunset with a lake reflection')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Style</Label>
                      <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {imageStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              <div className="flex items-center gap-2">
                                <span>{style.icon}</span>
                                <span>{style.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Size</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {imageSizes.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              <div className="flex items-center gap-2">
                                <span>{size.label}</span>
                                <Badge variant="outline" className="text-xs">{size.aspect}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">AI Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getMultimodalModels().map((model) => (
                          <SelectItem key={model} value={model}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{model}</span>
                              <Badge variant="outline" className="text-xs">Multimodal</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleGenerateImage} 
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full button-minimal"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

              {/* Image Output Panel */}
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
                        <Button size="sm" variant="outline" onClick={copyImageUrl}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={addToFavorites}>
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {getStyleIcon(selectedStyle)} {selectedStyle} • {selectedSize} • {selectedModel}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedImage ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <img 
                          src={generatedImage} 
                          alt="Generated" 
                          className="w-full h-auto rounded border"
                          style={{
                            transform: `scale(${zoomLevel / 100})`,
                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                          }}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            <Button size="sm" variant="secondary">
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <RotateCw className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <Crop className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{selectedStyle}</Badge>
                        <Badge variant="outline">{selectedSize}</Badge>
                        <Badge variant="outline">{selectedModel}</Badge>
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

              {/* Image Controls Panel */}
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Image Controls
                  </CardTitle>
                  <CardDescription>
                    Adjust and enhance your image
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Zoom</Label>
                      <span className="text-sm text-muted-foreground">{zoomLevel}%</span>
                    </div>
                    <Slider
                      value={[zoomLevel]}
                      onValueChange={(value) => setZoomLevel(value[0])}
                      max={200}
                      min={25}
                      step={25}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Brightness</Label>
                      <span className="text-sm text-muted-foreground">{brightness}%</span>
                    </div>
                    <Slider
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                      max={100}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Contrast</Label>
                      <span className="text-sm text-muted-foreground">{contrast}%</span>
                    </div>
                    <Slider
                      value={[contrast]}
                      onValueChange={(value) => setContrast(value[0])}
                      max={100}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Saturation</Label>
                      <span className="text-sm text-muted-foreground">{saturation}%</span>
                    </div>
                    <Slider
                      value={[saturation]}
                      onValueChange={(value) => setSaturation(value[0])}
                      max={100}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotate
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <FlipHorizontal className="h-4 w-4 mr-2" />
                      Flip
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Crop className="h-4 w-4 mr-2" />
                      Crop
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {imagePrompts.map((template, index) => (
                <Card key={index} className="card-minimal cursor-pointer hover:border-foreground/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{template.icon}</span>
                      {template.title}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{template.prompt}</p>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{template.style}</Badge>
                      <Badge variant="outline" className="text-xs">{template.size}</Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full button-outline-minimal"
                      onClick={() => {
                        setPrompt(template.prompt)
                        setSelectedStyle(template.style)
                        setSelectedSize(template.size)
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

          <TabsContent value="gallery" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Recent Images
                  </CardTitle>
                  <CardDescription>
                    Your generated images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {imageHistory.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {imageHistory.slice(0, 8).map((item) => (
                        <div key={item.id} className="relative group">
                          <img 
                            src={item.image} 
                            alt={item.prompt}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                            <div className="flex gap-1">
                              <Button size="sm" variant="secondary">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="secondary">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Layers className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground text-sm">
                        No images generated yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="card-minimal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Favorites
                  </CardTitle>
                  <CardDescription>
                    Your favorite images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {favoriteImages.slice(0, 8).map((item) => (
                        <div key={item.id} className="relative group">
                          <img 
                            src={item.image} 
                            alt={item.prompt}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                            <div className="flex gap-1">
                              <Button size="sm" variant="secondary">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="secondary">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground text-sm">
                        No favorites yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-6">
            <Card className="card-minimal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Image Editor
                </CardTitle>
                <CardDescription>
                  Advanced image editing tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Upload an image to edit</p>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button variant="outline" disabled>
                      <Crop className="h-4 w-4 mr-2" />
                      Crop
                    </Button>
                    <Button variant="outline" disabled>
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotate
                    </Button>
                    <Button variant="outline" disabled>
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <Button variant="outline" disabled>
                      <Maximize className="h-4 w-4 mr-2" />
                      Maximize
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}