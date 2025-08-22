"use client";

import React, { useState } from 'react';
import { useAppState } from '@/lib/app-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Trash2, Heart, Search, PlusCircle } from 'lucide-react';
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
    <Card className="flex flex-col overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="truncate font-headline text-lg">{font.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="w-full p-4 rounded-md bg-muted/50">
          <p
            className="break-words text-3xl"
            style={{ fontFamily: `'${font.name}', sans-serif` }}
          >
            الكتابة هنا
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-start gap-2 p-4 pt-0">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/try">
            <PenSquare className="h-4 w-4" />
            <span className="sr-only">تجربة</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          <span className="sr-only">تحميل</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(font.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
          <span className="sr-only">حذف</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Heart className="h-4 w-4" />
          <span className="sr-only">المفضلة</span>
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
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold">مكتبتي</h1>
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
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm text-center p-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFonts.map((font) => (
            <FontCard key={font.id} font={font} onDelete={deleteFont} />
          ))}
        </div>
      )}

      <Button asChild className="md:hidden fixed bottom-6 left-6 z-10 rounded-full h-14 w-14 shadow-lg">
        <Link href="/upload">
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">إضافة خط</span>
        </Link>
      </Button>
    </div>
  );
}
