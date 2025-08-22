"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Font } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import JSZip from 'jszip';

interface AppState {
  fonts: Font[];
  addFonts: (files: FileList) => void;
  deleteFont: (fontId: string) => void;
  loading: boolean;
  styleTagRef: React.RefObject<HTMLStyleElement>;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState(false);
  const styleTagRef = React.useRef<HTMLStyleElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const styleTag = document.createElement("style");
    document.head.appendChild(styleTag);
    styleTagRef.current = styleTag;
    return () => {
      if (styleTagRef.current) {
        document.head.removeChild(styleTagRef.current);
      }
    };
  }, []);

  useEffect(() => {
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

  const processFiles = async (files: File[]) => {
    const newFonts: Font[] = [];
    let invalidCount = 0;
    const validTypes = ["font/ttf", "font/otf", ".ttf", ".otf"];
    
    for (const file of files) {
      if (validTypes.some(type => file.type === type || file.name.endsWith(type))) {
        const fontName = file.name.replace(/\.(ttf|otf)$/i, "");
        if (fonts.some(f => f.name === fontName)) {
          toast({
            variant: "destructive",
            title: "خط موجود بالفعل",
            description: `الخط "${fontName}" موجود بالفعل في مكتبتك.`,
          })
          continue;
        }
        
        const url = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
        });

        newFonts.push({
          id: `${file.name}-${file.lastModified}`,
          name: fontName,
          file,
          url,
        });
      } else {
        invalidCount++;
      }
    }
    return { newFonts, invalidCount };
  }

  const addFonts = async (files: FileList) => {
    setLoading(true);
    let allNewFonts: Font[] = [];
    let totalInvalidCount = 0;

    for (const file of Array.from(files)) {
      if (file.name.endsWith('.zip')) {
        try {
          const zip = await JSZip.loadAsync(file);
          const fontFiles: File[] = [];
          const validExtensions = ['.ttf', '.otf'];

          const zipEntries = Object.values(zip.files);
          for(const zipEntry of zipEntries) {
            if (!zipEntry.dir && validExtensions.some(ext => zipEntry.name.toLowerCase().endsWith(ext))) {
              const blob = await zipEntry.async('blob');
              const fontFile = new File([blob], zipEntry.name, { type: blob.type });
              fontFiles.push(fontFile);
            }
          }
          const { newFonts, invalidCount } = await processFiles(fontFiles);
          allNewFonts.push(...newFonts);
          totalInvalidCount += invalidCount;

        } catch (error) {
          console.error("Error processing zip file", error);
          toast({
            variant: "destructive",
            title: "خطأ في معالجة الملف المضغوط",
            description: "لا يمكن قراءة الملف المضغوط. قد يكون تالفًا.",
          });
          totalInvalidCount++;
        }
      } else {
         const { newFonts, invalidCount } = await processFiles([file]);
         allNewFonts.push(...newFonts);
         totalInvalidCount += invalidCount;
      }
    }
    
    if (allNewFonts.length > 0) {
      setFonts((prev) => [...prev, ...allNewFonts]);
      toast({
        title: `تمت إضافة ${allNewFonts.length} خطوط بنجاح!`,
        description: "الخطوط الجديدة جاهزة للمعاينة.",
      });
    }

    if (totalInvalidCount > 0) {
      toast({
        variant: "destructive",
        title: "ملفات غير صالحة",
        description: `تم تجاهل ${totalInvalidCount} ملفات. يتم دعم .ttf, .otf, و .zip فقط.`,
      });
    }

    setLoading(false);
  };
  
  const deleteFont = (fontId: string) => {
    setFonts((prev) => prev.filter((font) => font.id !== fontId));
    toast({
      title: "تم حذف الخط",
      description: "تم حذف الخط من مكتبتك بنجاح.",
    });
  };

  const value = {
    fonts,
    addFonts,
    deleteFont,
    loading,
    styleTagRef
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
