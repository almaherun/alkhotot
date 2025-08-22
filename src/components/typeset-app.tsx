"use client";

import * as React from "react";
import {
  Upload,
  Trash2,
  Download,
  Palette,
  Type,
  FileText,
  Plus,
  Github,
} from "lucide-react";
import { type Font } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ColorInput } from "@/components/ui/color-input";
import { useTheme } from "@/components/theme-provider";

function FontCard({
  font,
  onDelete,
  previewText,
  previewStyle,
}: {
  font: Font;
  onDelete: (fontId: string) => void;
  previewText: string;
  previewStyle: React.CSSProperties;
}) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(font.file);
    link.download = font.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="truncate font-headline">{font.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div
          className="w-full rounded-md p-4 transition-colors"
          style={{
            backgroundColor: previewStyle.backgroundColor,
          }}
        >
          <p
            className="break-words text-2xl transition-all"
            style={{
              fontFamily: `'${font.name}', sans-serif`,
              color: previewStyle.color,
              fontSize: `${previewStyle.fontSize}px`,
            }}
          >
            {previewText || "The quick brown fox jumps over the lazy dog."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          <span className="sr-only">Download</span>
        </Button>
        <Button variant="destructive" size="icon" onClick={() => onDelete(font.id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

function FontUploader({ onFilesAdded, loading }: { onFilesAdded: (files: FileList) => void, loading: boolean }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed transition-colors duration-300 ${isDragging ? "border-primary bg-primary/10" : "bg-muted/50"}`}
    >
        <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <input ref={fileInputRef} type="file" multiple accept=".ttf,.otf" className="hidden" onChange={handleChange} />
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <div className="rounded-full border-8 border-muted p-4 bg-background">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Drag & drop your fonts here</h3>
                <p className="text-muted-foreground">or click to browse. Supports .TTF and .OTF</p>
                <Button onClick={onButtonClick} disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" />
                    Browse Files
                </Button>
                {loading && (
                    <div className="w-full max-w-sm mt-4">
                      <Progress value={100} className="h-2 animate-pulse" />
                      <p className="text-sm text-muted-foreground mt-1">Processing fonts...</p>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
  );
}

export default function TypeSetApp() {
  const [fonts, setFonts] = React.useState<Font[]>([]);
  const [previewText, setPreviewText] = React.useState("");
  const [fontSize, setFontSize] = React.useState(32);
  const [bgColor, setBgColor] = React.useState("#fcf8ff");
  const [textColor, setTextColor] = React.useState("#332d3b");
  const [loading, setLoading] = React.useState(false);
  const styleTagRef = React.useRef<HTMLStyleElement | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const styleTag = document.createElement("style");
    document.head.appendChild(styleTag);
    styleTagRef.current = styleTag;
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  React.useEffect(() => {
    if (styleTagRef.current) {
      const fontFaceRules = fonts
        .map(
          (font) => `
        @font-face {
          font-family: '${font.name}';
          src: url('${font.url}');
        }
      `
        )
        .join("\n");
      styleTagRef.current.innerHTML = fontFaceRules;
    }
  }, [fonts]);
  
  const { theme } = useTheme();

  React.useEffect(() => {
    if (theme === 'dark') {
      setBgColor("#1a1620");
      setTextColor("#d8d3e0");
    } else {
      setBgColor("#fcf8ff");
      setTextColor("#332d3b");
    }
  }, [theme]);


  const addFonts = (files: FileList) => {
    setLoading(true);
    const newFonts: Font[] = [];
    const validTypes = ["font/ttf", "font/otf", ".ttf", ".otf"];
    let invalidCount = 0;

    Array.from(files).forEach((file) => {
      if (validTypes.some(type => file.type === type || file.name.endsWith(type))) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fontName = file.name.replace(/\.(ttf|otf)$/i, "");
          if (fonts.some(f => f.name === fontName)) {
            toast({
              variant: "destructive",
              title: "Font already exists",
              description: `The font "${fontName}" is already in your library.`,
            })
            return;
          }
          
          newFonts.push({
            id: `${file.name}-${file.lastModified}`,
            name: fontName,
            file,
            url: e.target?.result as string,
          });

          if(newFonts.length + invalidCount === files.length) {
            setFonts((prev) => [...prev, ...newFonts]);
            if (newFonts.length > 0) {
                toast({
                  title: `${newFonts.length} font${newFonts.length > 1 ? 's' : ''} added!`,
                  description: "Your new fonts are ready to be previewed.",
                })
            }
            setLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        invalidCount++;
        if(newFonts.length + invalidCount === files.length) {
            setLoading(false);
        }
      }
    });

    if (invalidCount > 0) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${invalidCount} file${invalidCount > 1 ? 's were' : ' was'} ignored. Only TTF and OTF are supported.`,
        })
    }
  };
  
  const deleteFont = (fontId: string) => {
    setFonts((prev) => prev.filter((font) => font.id !== fontId));
     toast({
      title: "Font removed",
      description: "The font has been removed from your library.",
    })
  };
  
  const previewStyle = { fontSize, backgroundColor: bgColor, color: textColor };

  return (
    <div className="flex min-h-screen w-full flex-col font-body">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight font-headline">TypeSet</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/firebase/genkit/tree/main/firebase-studio-prototyping-examples" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-8">
          <Card>
            <CardContent className="p-6 grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="preview-text">
                  <Type className="inline-block mr-2 h-4 w-4" />
                  Preview Text
                </Label>
                <Textarea
                  id="preview-text"
                  placeholder="Type anything to preview your fonts..."
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="h-24"
                />
              </div>
              <div className="grid gap-2">
                 <Label htmlFor="preview-style">
                    <Palette className="inline-block mr-2 h-4 w-4" />
                    Styling
                 </Label>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="font-size" className="text-sm text-muted-foreground">Font Size: {fontSize}px</Label>
                        <Slider
                            id="font-size"
                            min={8}
                            max={128}
                            step={1}
                            value={[fontSize]}
                            onValueChange={(value) => setFontSize(value[0])}
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="bg-color" className="text-sm text-muted-foreground">Background</Label>
                        <ColorInput id="bg-color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="text-color" className="text-sm text-muted-foreground">Text</Label>
                        <ColorInput id="text-color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Your Font Library ({fonts.length})</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {fonts.map((font) => (
                <FontCard
                  key={font.id}
                  font={font}
                  onDelete={deleteFont}
                  previewText={previewText}
                  previewStyle={previewStyle}
                />
              ))}
              <FontUploader onFilesAdded={addFonts} loading={loading} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
