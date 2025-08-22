"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppState } from '@/lib/app-state';
import { useTheme } from "@/components/theme-provider";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Palette, Type, ListPlus, ArrowLeft, PlusCircle } from 'lucide-react';
import { ColorInput } from '@/components/ui/color-input';

export function TryPage() {
  const { fonts } = useAppState();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [previewText, setPreviewText] = useState("الكتابة الإبداعية هي فن يتطلب خيالاً واسعاً");
  const [fontSize, setFontSize] = useState(48);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#111827");
  const [selectedFontId, setSelectedFontId] = useState<string | null>(null);
  
  useEffect(() => {
    if (theme === 'dark') {
      setBgColor("#1E1E1E");
      setTextColor("#f9fafb");
    } else {
      setBgColor("#ffffff");
      setTextColor("#111827");
    }
  }, [theme]);

  useEffect(() => {
    const fontIdFromUrl = searchParams.get('fontId');
    if (fontIdFromUrl) {
      setSelectedFontId(fontIdFromUrl);
    }
  }, [searchParams]);
  
  const selectedFont = fonts.find(font => font.id === selectedFontId);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">جرب الخطوط</h1>
         <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            رجوع
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <Label htmlFor="preview-text" className="text-lg font-medium mb-2 block">
                        <Type className="inline-block ml-2 h-5 w-5" />
                        النص التجريبي
                    </Label>
                    <Textarea
                      id="preview-text"
                      placeholder="اكتب أي نص لمعاينة خطوطك..."
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      className="h-32 text-lg"
                    />
                  </div>
                </div>
              </CardContent>
           </Card>
           
           {selectedFont ? (
              <div className="space-y-4">
                  <Card className="overflow-hidden">
                    <CardContent className="p-4" style={{ backgroundColor: bgColor }}>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-sm font-semibold">{selectedFont.name}</span>
                        </div>
                        <p
                          className="break-words"
                          style={{
                            fontFamily: `'${selectedFont.name}', sans-serif`,
                            fontSize: `${fontSize}px`,
                            color: textColor,
                            minHeight: '100px',
                          }}
                        >
                          {previewText}
                        </p>
                    </CardContent>
                  </Card>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">
                      <PlusCircle className="ml-2 h-4 w-4" />
                      اختيار أو تغيير الخط
                    </Link>
                  </Button>
              </div>
           ) : (
             <div className="text-center p-10 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">لم يتم اختيار أي خط بعد.</p>
                <Button asChild>
                    <Link href="/">
                        <ListPlus className="ml-2 h-4 w-4" />
                        اذهب للمكتبة لاختيار خط
                    </Link>
                </Button>
             </div>
           )}
        </div>
        
        <div className="md:col-span-1 space-y-6">
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div>
                      <Label className="flex items-center text-lg font-medium mb-4">
                        <Palette className="inline-block ml-2 h-5 w-5" />
                        أدوات التحكم
                      </Label>
                      <div className="space-y-4">
                          <div className="grid gap-1.5">
                              <Label htmlFor="font-size" className="text-sm text-muted-foreground">حجم الخط: {fontSize}px</Label>
                              <Slider
                                  id="font-size"
                                  min={8}
                                  max={128}
                                  step={1}
                                  value={[fontSize]}
                                  onValueChange={(value) => setFontSize(value[0])}
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="text-color" className="text-sm text-muted-foreground">لون النص</Label>
                                <ColorInput id="text-color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="bg-color" className="text-sm text-muted-foreground">لون الخلفية</Label>
                                <ColorInput id="bg-color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                            </div>
                          </div>
                      </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
