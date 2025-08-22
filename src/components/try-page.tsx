"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '@/lib/app-state';
import { useTheme } from "@/components/theme-provider";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Palette, Type, ListPlus } from 'lucide-react';
import { ColorInput } from '@/components/ui/color-input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TryPage() {
  const { fonts } = useAppState();
  const { theme } = useTheme();
  const searchParams = useSearchParams();

  const [previewText, setPreviewText] = useState("الكتابة الإبداعية هي فن يتطلب خيالاً واسعاً");
  const [fontSize, setFontSize] = useState(48);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#111827");
  const [selectedFontIds, setSelectedFontIds] = useState<string[]>([]);
  
  useEffect(() => {
    if (theme === 'dark') {
      setBgColor("#111827");
      setTextColor("#f9fafb");
    } else {
      setBgColor("#ffffff");
      setTextColor("#111827");
    }
  }, [theme]);

  useEffect(() => {
    const fontIdFromUrl = searchParams.get('fontId');
    if (fontIdFromUrl) {
      setSelectedFontIds([fontIdFromUrl]);
    }
  }, [searchParams]);
  
  const handleFontSelection = (fontId: string) => {
    setSelectedFontIds(prev => 
      prev.includes(fontId) 
        ? prev.filter(id => id !== fontId)
        : [...prev, fontId]
    );
  };
  
  const fontsToDisplay = selectedFontIds.length > 0
    ? fonts.filter(font => selectedFontIds.includes(font.id))
    : [];

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">جرب الخطوط</h1>
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
                  <div className="flex-shrink-0 self-end">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <ListPlus className="ml-2 h-4 w-4" />
                          اختر خط
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>الخطوط المتاحة</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {fonts.map(font => (
                           <DropdownMenuCheckboxItem
                            key={font.id}
                            checked={selectedFontIds.includes(font.id)}
                            onCheckedChange={() => handleFontSelection(font.id)}
                          >
                            {font.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
           </Card>
           
           {fontsToDisplay.length > 0 ? (
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-lg" 
                >
                  <div className={`grid grid-cols-1 gap-4`}>
                    {fontsToDisplay.map((font) => (
                      <Card key={font.id} className="overflow-hidden">
                        <CardContent className="p-4" style={{ backgroundColor: bgColor }}>
                            <div className="flex justify-between items-center mb-2">
                               <span className="text-sm font-semibold">{font.name}</span>
                            </div>
                            <p
                              className="break-words"
                              style={{
                                fontFamily: `'${font.name}', sans-serif`,
                                fontSize: `${fontSize}px`,
                                color: textColor,
                                minHeight: '100px',
                              }}
                            >
                              {previewText}
                            </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
           ) : (
             <div className="text-center p-10 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">اختر خطًا من القائمة أعلاه لبدء المعاينة.</p>
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
