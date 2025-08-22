"use client";

import React, { useState } from 'react';
import { useAppState } from '@/lib/app-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Trash2, PenSquare, Search, PlusCircle } from 'lucide-react';
import Link from 'next/link';

function FontCard({ font, onDelete }: { font: any, onDelete: (id: string) => void }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = font.url;
    link.download = font.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="flex flex-col overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <CardHeader>
        <CardTitle className="font-headline text-2xl truncate">{font.name}</CardTitle>
        <CardDescription>نموذج عرض الخط</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <div
          className="w-full p-4 rounded-md bg-muted/50"
          style={{ fontFamily: `'${font.name}', sans-serif` }}
        >
          <p className="text-4xl md:text-5xl lg:text-6xl break-words mb-4 text-center">أبجد هوز</p>
          <p className="text-lg md:text-xl break-words text-center text-muted-foreground">
            الساحة الفنية كانت دائمًا مرآة
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button variant="ghost" asChild>
          <Link href={`/try?fontId=${encodeURIComponent(font.id)}`}>
            <PenSquare className="ml-2 h-4 w-4" />
            تجربة
          </Link>
        </Button>
        <Button variant="ghost" onClick={handleDownload}>
          <Download className="ml-2 h-4 w-4" />
          تحميل
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(font.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
          <span className="sr-only">حذف</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function LibraryPage() {
  const { fonts, deleteFont } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFonts = fonts.filter(font =>
    font.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-3xl font-bold">مكتبتي</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن خط..."
            className="pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {fonts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm text-center p-8 mt-4">
            <h3 className="text-2xl font-bold tracking-tight">مكتبتك فارغة</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              ليس لديك أي خطوط بعد. ابدأ بإضافة بعض الخطوط.
            </p>
            <Button asChild>
              <Link href="/upload">
                <PlusCircle className="ml-2 h-4 w-4" />
                أضف خطوط
              </Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredFonts.map((font) => (
            <FontCard key={font.id} font={font} onDelete={deleteFont} />
          ))}
        </div>
      )}
    </div>
  );
}
