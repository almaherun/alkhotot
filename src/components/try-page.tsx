"use client";

import React, { useState, useEffect } from 'react';
import { useAppState } from '@/lib/app-state';
import { useTheme } from 'next-themes';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Palette, Type, CheckSquare, Square } from 'lucide-react';
import { ColorInput } from '@/components/ui/color-input';

export function TryPage() {
  const { fonts } = useAppState();
  const { theme } = useTheme();
  const [previewText, setPreviewText] = useState("الكتابة الإبداعية هي فن يتطلب خيالاً واسعاً");
  const [fontSize, setFontSize] = useState(48);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#111827");
  const [selectedFonts, setSelectedFonts] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  
  useEffect(() => {
    if (theme === 'dark') {
      setBgColor("#111827");
      setTextColor("#f9fafb");
    } else {
      setBgColor("#ffffff");
      setTextColor("#111827");
    }
  }, [theme]);
  
  const handleFontSelection = (fontName: string) => {
    setSelectedFonts(prev => 
      prev.includes(fontName) 
        ? prev.filter(name => name !== fontName)
        : [...prev, fontName]
    );
  };
  
  const fontsToDisplay = compareMode 
    ? fonts.filter(font => selectedFonts.includes(font.name))
    : fonts;

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">جرب الخطوط</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           <Card>
              <CardContent className="p-6">
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
              </CardContent>
           </Card>
           
          <div className="space-y-4">
            <div 
              className="p-4 rounded-lg" 
              style={{ backgroundColor: compareMode ? bgColor : 'transparent' }}
            >
              <div className={`grid grid-cols-1 ${compareMode ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
                {fontsToDisplay.map((font) => (
                  <Card key={font.id} className="overflow-hidden">
                    <CardContent className="p-4" style={{ backgroundColor: bgColor }}>
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-sm font-semibold">{font.name}</span>
                            {compareMode && 
                              <Checkbox
                                checked={selectedFonts.includes(font.name)}
                                onCheckedChange={() => handleFontSelection(font.name)}
                              />
                            }
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
                    <div>
                      <Label className="flex items-center text-lg font-medium mb-4">
                         {compareMode ? <CheckSquare className="inline-block ml-2 h-5 w-5" /> : <Square className="inline-block ml-2 h-5 w-5" />}
                        مقارنة
                      </Label>
                       <div className="items-top flex space-x-2 space-x-reverse">
                          <Checkbox id="compare-mode" checked={compareMode} onCheckedChange={(checked) => setCompareMode(!!checked)} />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="compare-mode"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              تفعيل وضع المقارنة
                            </label>
                            <p className="text-sm text-muted-foreground">
                              اختر عدة خطوط لعرضها جنبًا إلى جنب.
                            </p>
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
