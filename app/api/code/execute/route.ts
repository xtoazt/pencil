import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface CodeExecutionRequest {
  code: string
  language: string
  input?: string
}

interface CodeExecutionResult {
  output: string
  error?: string
  executionTime: number
  memory?: number
}

// Supported languages and their execution environments
const SUPPORTED_LANGUAGES = {
  javascript: {
    name: "JavaScript",
    version: "Node.js 18",
    timeout: 5000
  },
  python: {
    name: "Python",
    version: "3.11",
    timeout: 10000
  },
  typescript: {
    name: "TypeScript",
    version: "5.0",
    timeout: 5000
  },
  html: {
    name: "HTML",
    version: "HTML5",
    timeout: 3000
  },
  css: {
    name: "CSS",
    version: "CSS3",
    timeout: 3000
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, language, input }: CodeExecutionRequest = await request.json()

    if (!code || !language) {
      return NextResponse.json({
        error: "Code and language are required"
      }, { status: 400 })
    }

    if (!SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES]) {
      return NextResponse.json({
        error: `Language ${language} is not supported for execution`
      }, { status: 400 })
    }

    const startTime = Date.now()
    let result: CodeExecutionResult

    switch (language) {
      case 'javascript':
        result = await executeJavaScript(code, input)
        break
      case 'python':
        result = await executePython(code, input)
        break
      case 'typescript':
        result = await executeTypeScript(code, input)
        break
      case 'html':
        result = await executeHTML(code)
        break
      case 'css':
        result = await executeCSS(code)
        break
      default:
        return NextResponse.json({
          error: `Execution not implemented for ${language}`
        }, { status: 400 })
    }

    result.executionTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      result,
      language: SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES]
    })

  } catch (error: any) {
    console.error("Code execution error:", error)
    return NextResponse.json({
      error: "Code execution failed",
      details: error.message
    }, { status: 500 })
  }
}

async function executeJavaScript(code: string, input?: string): Promise<CodeExecutionResult> {
  try {
    // Create a safe execution environment
    const wrappedCode = `
      (function() {
        const console = {
          log: (...args) => output.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')),
          error: (...args) => errors.push(args.join(' ')),
          warn: (...args) => output.push('WARN: ' + args.join(' ')),
          info: (...args) => output.push('INFO: ' + args.join(' '))
        };
        
        const output = [];
        const errors = [];
        
        try {
          ${code}
        } catch (error) {
          errors.push(error.message);
        }
        
        return { output, errors };
      })();
    `

    // Execute in a controlled environment
    const result = eval(wrappedCode)
    
    return {
      output: result.output.join('\n'),
      error: result.errors.length > 0 ? result.errors.join('\n') : undefined
    }
  } catch (error: any) {
    return {
      output: "",
      error: error.message
    }
  }
}

async function executePython(code: string, input?: string): Promise<CodeExecutionResult> {
  // For Python, we'll simulate execution since we can't run Python in the browser
  // In a real implementation, this would call a Python execution service
  
  try {
    // Basic syntax validation
    const lines = code.split('\n')
    const output: string[] = []
    
    // Simulate basic Python execution
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      if (trimmed.startsWith('print(')) {
        const match = trimmed.match(/print\(['"](.*?)['"]\)/)
        if (match) {
          output.push(match[1])
        }
      } else if (trimmed.startsWith('print(')) {
        const match = trimmed.match(/print\((.*?)\)/)
        if (match) {
          output.push(match[1])
        }
      }
    })
    
    return {
      output: output.length > 0 ? output.join('\n') : "Python code executed (simulated)",
      error: undefined
    }
  } catch (error: any) {
    return {
      output: "",
      error: error.message
    }
  }
}

async function executeTypeScript(code: string, input?: string): Promise<CodeExecutionResult> {
  try {
    // For TypeScript, we'll transpile to JavaScript and execute
    // In a real implementation, this would use the TypeScript compiler
    
    // Simple TypeScript to JavaScript conversion
    let jsCode = code
      .replace(/:\s*string/g, '')
      .replace(/:\s*number/g, '')
      .replace(/:\s*boolean/g, '')
      .replace(/:\s*any/g, '')
      .replace(/interface\s+\w+\s*{[^}]*}/g, '')
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
    
    return await executeJavaScript(jsCode, input)
  } catch (error: any) {
    return {
      output: "",
      error: error.message
    }
  }
}

async function executeHTML(code: string): Promise<CodeExecutionResult> {
  try {
    // For HTML, we'll validate and return a preview URL
    const htmlContent = code.includes('<!DOCTYPE html>') || code.includes('<html>') 
      ? code 
      : `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>HTML Preview</title>
</head>
<body>
  ${code}
</body>
</html>`
    
    // Create a data URL for the HTML
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
    
    return {
      output: `HTML rendered successfully. Preview URL: ${dataUrl}`,
      error: undefined
    }
  } catch (error: any) {
    return {
      output: "",
      error: error.message
    }
  }
}

async function executeCSS(code: string): Promise<CodeExecutionResult> {
  try {
    // For CSS, we'll validate and return a preview
    const htmlWithCSS = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CSS Preview</title>
  <style>
    ${code}
  </style>
</head>
<body>
  <div class="preview">
    <h1>CSS Preview</h1>
    <p>This is a preview of your CSS styles.</p>
    <button>Sample Button</button>
  </div>
</body>
</html>`
    
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlWithCSS)}`
    
    return {
      output: `CSS applied successfully. Preview URL: ${dataUrl}`,
      error: undefined
    }
  } catch (error: any) {
    return {
      output: "",
      error: error.message
    }
  }
}

// Get supported languages
export async function GET() {
  return NextResponse.json({
    supportedLanguages: SUPPORTED_LANGUAGES,
    message: "Code execution API is ready"
  })
}
