"use client";

import React, { useState, useRef } from 'react';
import { useAppState } from '@/lib/app-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, File, Folder, FileArchive } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export function UploadPage() {
  const { addFonts, loading } = useAppState();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      addFonts(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFonts(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-3xl font-bold mb-8">أضف خط جديد</h1>
        <Card
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`w-full max-w-2xl border-2 border-dashed transition-colors duration-300 ${isDragging ? "border-primary bg-primary/10" : "bg-muted/50 hover:border-primary/50"}`}
        >
          <CardContent className="flex flex-col items-center justify-center p-10 md:p-20">
              <input ref={fileInputRef} type="file" multiple accept=".ttf,.otf,.zip" className="hidden" onChange={handleChange} />
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                  <div className="rounded-full border-8 border-muted p-5 bg-background mb-4">
                      <UploadCloud className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">اسحب ملفاتك هنا أو اختر من جهازك</h3>
                  <p className="text-muted-foreground">دعم رفع ملف خط فردي / عدة خطوط / ملف مضغوط</p>
                  <Button onClick={onButtonClick} disabled={loading} size="lg" className="mt-4">
                      تصفح الملفات
                  </Button>
                  {loading && (
                      <div className="w-full max-w-md mt-6">
                        <Progress value={100} className="h-2 animate-pulse" />
                        <p className="text-sm text-muted-foreground mt-2">...جاري معالجة الخطوط</p>
                      </div>
                  )}
              </div>
          </CardContent>
        </Card>
        <p className="text-muted-foreground mt-6 text-sm">
            يدعم <File className="inline-block h-4 w-4 mx-1" />.ttf / <File className="inline-block h-4 w-4 mx-1" />.otf / <FileArchive className="inline-block h-4 w-4 mx-1" />.zip
        </p>
    </div>
  );
}
