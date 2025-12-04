"use client";

import {
  ProjectContent,
  ProjectHeading,
  ProjectSection,
  ProjectSectionContent,
  ProjectSubHeading,
  ProjectText,
  ProjectTextBlock,
} from "@/app/projects/components/ProjectContent";
import Header from "@/components/Header";
import ShadowBackground from "@/components/shadows/ShadowBackground";
import { CodeBlock, CodeBlockDark, InlineCode } from "@/components/ui/Code";

export default function CodeDemoPage() {
  return (
    <main className="min-h-screen font-sans relative">
      <ShadowBackground className="min-h-screen flex flex-col">
        <Header />

        {/* Hero Content */}
        <div className="flex-1 w-full max-w-site mx-auto flex flex-col gap-8 px-8 md:px-12 pb-20 pt-32 md:pt-48">
          <h1 className="text-5xl md:text-7xl text-zinc-900 leading-[1.1] font-sentient">
            Code Syntax
            <br />
            Highlighting
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 max-w-2xl">
            Inline code spans and full code blocks with syntax highlighting for
            project documentation.
          </p>
        </div>
      </ShadowBackground>

      <ProjectContent>
        {/* Inline Code Demo */}
        <ProjectSection>
          <ProjectHeading>Inline Code</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              You can use inline code for short snippets like{" "}
              <InlineCode>const x = 42</InlineCode> or function names like{" "}
              <InlineCode>handleClick()</InlineCode>. It works seamlessly within
              paragraphs and maintains readable flow. Reference variables like{" "}
              <InlineCode>useState</InlineCode> or file paths like{" "}
              <InlineCode>src/components/Button.tsx</InlineCode>.
            </ProjectText>

            <ProjectTextBlock>
              <ProjectSubHeading>Use Cases</ProjectSubHeading>
              <ProjectText>
                Inline code is perfect for mentioning{" "}
                <InlineCode>npm install</InlineCode> commands, CSS properties
                like <InlineCode>display: flex</InlineCode>, or API endpoints
                such as <InlineCode>/api/users/:id</InlineCode>.
              </ProjectText>
            </ProjectTextBlock>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Light Code Block Demo */}
        <ProjectSection>
          <ProjectHeading>Code Blocks (Light)</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              Full code blocks with syntax highlighting, optional line numbers,
              and filename headers.
            </ProjectText>

            <ProjectTextBlock>
              <ProjectSubHeading>TypeScript / React</ProjectSubHeading>
              <ProjectText>
                Here is a React component with TypeScript:
              </ProjectText>
            </ProjectTextBlock>

            <CodeBlock
              language="tsx"
              filename="Button.tsx"
              showLineNumbers
            >{`import { useState } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={\`px-4 py-2 rounded-lg \${isHovered ? "bg-blue-600" : "bg-blue-500"}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {label}
    </button>
  );
}`}</CodeBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>Swift</ProjectSubHeading>
              <ProjectText>
                Native Swift code for the Convert &amp; Compress app:
              </ProjectText>
            </ProjectTextBlock>

            <CodeBlock language="swift" filename="ImageProcessor.swift">{`
import AppKit
import ImageIO

struct ImageProcessor {
    func compress(image: NSImage, quality: Double) -> Data? {
        guard let tiffData = image.tiffRepresentation,
              let bitmap = NSBitmapImageRep(data: tiffData) else {
            return nil
        }
        
        let properties: [NSBitmapImageRep.PropertyKey: Any] = [
            .compressionFactor: quality
        ]
        
        return bitmap.representation(
            using: .jpeg,
            properties: properties
        )
    }
}
`}</CodeBlock>

            <ProjectTextBlock>
              <ProjectSubHeading>CSS</ProjectSubHeading>
              <ProjectText>Styling example with CSS:</ProjectText>
            </ProjectTextBlock>

            <CodeBlock language="css">{`
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}
`}</CodeBlock>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Dark Code Block Demo */}
        <ProjectSection>
          <ProjectHeading>Code Blocks (Dark)</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              A dark variant with macOS-style traffic lights, perfect for
              terminal commands and editor screenshots.
            </ProjectText>

            <CodeBlockDark
              language="bash"
              filename="Terminal"
              showLineNumbers
            >{`# Install dependencies
npm install prism-react-renderer

# Run development server
npm run dev

# Build for production
npm run build && npm start`}</CodeBlockDark>

            <ProjectTextBlock>
              <ProjectSubHeading>JSON Configuration</ProjectSubHeading>
              <ProjectText>
                Configuration files look great in dark mode:
              </ProjectText>
            </ProjectTextBlock>

            <CodeBlockDark language="json" filename="package.json">{`{
  "name": "convert-compress",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^19.0.0",
    "next": "^15.0.0"
  }
}`}</CodeBlockDark>

            <ProjectTextBlock>
              <ProjectSubHeading>Python</ProjectSubHeading>
              <ProjectText>Dark theme works with any language:</ProjectText>
            </ProjectTextBlock>

            <CodeBlockDark
              language="python"
              filename="main.py"
              showLineNumbers
            >{`
from PIL import Image
import os

def batch_compress(input_dir: str, quality: int = 85):
    """Compress all images in a directory."""
    for filename in os.listdir(input_dir):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            path = os.path.join(input_dir, filename)
            with Image.open(path) as img:
                img.save(
                    path,
                    optimize=True,
                    quality=quality
                )
                print(f"Compressed: {filename}")

if __name__ == "__main__":
    batch_compress("./images", quality=80)
`}</CodeBlockDark>
          </ProjectSectionContent>
        </ProjectSection>

        {/* Without Headers */}
        <ProjectSection>
          <ProjectHeading>Minimal Style</ProjectHeading>
          <ProjectSectionContent>
            <ProjectText>
              Code blocks without filenames show just the language badge:
            </ProjectText>

            <CodeBlock language="javascript">{`
const sum = (a, b) => a + b;
const multiply = (a, b) => a * b;

console.log(sum(2, 3));       // 5
console.log(multiply(4, 5));  // 20
`}</CodeBlock>

            <ProjectText>Or completely minimal without any header:</ProjectText>

            <CodeBlockDark>{`SELECT users.name, COUNT(orders.id) as order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE orders.created_at > NOW() - INTERVAL '30 days'
GROUP BY users.id
ORDER BY order_count DESC
LIMIT 10;`}</CodeBlockDark>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContent>
    </main>
  );
}
