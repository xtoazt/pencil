"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Paperclip, 
  Image as ImageIcon, 
  Link, 
  FileText, 
  Video, 
  Music, 
  Archive, 
  Code, 
  X, 
  Upload, 
  Download,
  Eye,
  Copy,
  ExternalLink,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  Plus,
  Minus,
  RotateCw,
  Crop,
  Palette,
  Type,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link2,
  Smile,
  AtSign,
  Hash,
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Camera,
  Scan,
  QrCode,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Filter,
  Search,
  Bookmark,
  Share,
  MoreHorizontal
} from "lucide-react"

interface Attachment {
  id: string
  type: "image" | "file" | "link" | "text" | "audio" | "video" | "code"
  name: string
  content?: string
  url?: string
  size?: number
  preview?: string
}

interface ChatAttachmentsProps {
  onAttachmentsChange: (attachments: Attachment[]) => void
  attachments: Attachment[]
}

export function ChatAttachments({ onAttachmentsChange, attachments }: ChatAttachmentsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"file" | "link" | "image" | "text" | "voice">("file")
  const [linkUrl, setLinkUrl] = useState("")
  const [linkTitle, setLinkTitle] = useState("")
  const [textContent, setTextContent] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const attachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        type: getFileType(file.type),
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      }

      if (file.type.startsWith('image/')) {
        attachment.preview = URL.createObjectURL(file)
      }

      onAttachmentsChange([...attachments, attachment])
    })
  }

  const getFileType = (mimeType: string): Attachment["type"] => {
    if (mimeType.startsWith('image/')) return "image"
    if (mimeType.startsWith('video/')) return "video"
    if (mimeType.startsWith('audio/')) return "audio"
    if (mimeType.includes('text') || mimeType.includes('code')) return "code"
    return "file"
  }

  const getFileIcon = (type: Attachment["type"]) => {
    switch (type) {
      case "image": return <FileImage className="h-4 w-4" />
      case "video": return <FileVideo className="h-4 w-4" />
      case "audio": return <FileAudio className="h-4 w-4" />
      case "code": return <FileCode className="h-4 w-4" />
      case "file": return <File className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const addLink = () => {
    if (!linkUrl.trim()) return

    const attachment: Attachment = {
      id: Math.random().toString(36).substr(2, 9),
      type: "link",
      name: linkTitle || linkUrl,
      url: linkUrl
    }

    onAttachmentsChange([...attachments, attachment])
    setLinkUrl("")
    setLinkTitle("")
  }

  const addText = () => {
    if (!textContent.trim()) return

    const attachment: Attachment = {
      id: Math.random().toString(36).substr(2, 9),
      type: "text",
      name: "Text Note",
      content: textContent
    }

    onAttachmentsChange([...attachments, attachment])
    setTextContent("")
  }

  const removeAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== id))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        const attachment: Attachment = {
          id: Math.random().toString(36).substr(2, 9),
          type: "audio",
          name: `Voice Note ${new Date().toLocaleTimeString()}`,
          url: URL.createObjectURL(audioBlob)
        }
        onAttachmentsChange([...attachments, attachment])
        setAudioChunks([])
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const tabs = [
    { id: "file", label: "Files", icon: Paperclip },
    { id: "image", label: "Images", icon: ImageIcon },
    { id: "link", label: "Links", icon: Link },
    { id: "text", label: "Text", icon: Type },
    { id: "voice", label: "Voice", icon: Mic },
  ]

  return (
    <div className="space-y-2">
      {/* Attachment Toggle */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Paperclip className="h-4 w-4" />
          Attachments
          {attachments.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {attachments.length}
            </Badge>
          )}
        </Button>
        
        {attachments.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAttachmentsChange([])}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <Card key={attachment.id} className="card-minimal p-2 max-w-xs">
              <CardContent className="p-0">
                <div className="flex items-center gap-2">
                  {attachment.type === "image" && attachment.preview ? (
                    <img 
                      src={attachment.preview} 
                      alt={attachment.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      {getFileIcon(attachment.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{attachment.name}</p>
                    {attachment.size && (
                      <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {attachment.url && (
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => removeAttachment(attachment.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Attachment Panel */}
      {isExpanded && (
        <Card className="card-minimal">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    size="sm"
                    variant={activeTab === tab.id ? "default" : "outline"}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === "file" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Files
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => imageInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Upload Images
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="*/*"
                    />
                    <input
                      ref={imageInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                )}

                {activeTab === "image" && (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Upload Images
                    </Button>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Camera
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Scan className="h-4 w-4" />
                        Scan
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        QR Code
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "link" && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter URL"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                      />
                      <Input
                        placeholder="Link title (optional)"
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                      />
                    </div>
                    <Button onClick={addLink} className="w-full">
                      <Link className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                )}

                {activeTab === "text" && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Enter text content..."
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Underline className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Code2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={addText} className="w-full">
                      <Type className="h-4 w-4 mr-2" />
                      Add Text
                    </Button>
                  </div>
                )}

                {activeTab === "voice" && (
                  <div className="space-y-3">
                    <div className="text-center">
                      {isRecording ? (
                        <div className="space-y-2">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <Mic className="h-8 w-8 text-red-600 animate-pulse" />
                          </div>
                          <p className="text-sm text-muted-foreground">Recording...</p>
                          <Button onClick={stopRecording} variant="destructive">
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop Recording
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <Mic className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">Click to start recording</p>
                          <Button onClick={startRecording}>
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
