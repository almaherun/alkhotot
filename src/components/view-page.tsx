"use client";

import React from 'react';
import { useAppState } from '@/lib/app-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, PenSquare, PlusCircle } from 'lucide-react';
import Link from 'next/link';

function ViewFontCard({ font }: { font: any }) {
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
        <CardTitle className="font-headline text-2xl">{font.name}</CardTitle>
        <CardDescription>نموذج عرض الخط</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <div
          className="w-full p-4 rounded-md bg-muted/30"
          style={{ fontFamily: `'${font.name}', sans-serif` }}
        >
          <p className="text-4xl md:text-5xl lg:text-6xl break-words mb-4 text-center">أبجد هوز</p>
          <p className="text-lg md:text-xl break-words text-center text-muted-foreground">
            الساحة الفنية كانت دائمًا مرآة تعكس ثقافة المجتمع وتطلعاته
          </p>
        </div>
      </CardContent>
      <div className="p-4 pt-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button variant="ghost" asChild>
          <Link href="/try">
            <PenSquare className="ml-2" />
            تجربة
          </Link>
        </Button>
        <Button variant="ghost" onClick={handleDownload}>
          <Download className="ml-2" />
          تحميل
        </Button>
      </div>
    </Card>
  );
}

export function ViewPage() {
  const { fonts } = useAppState();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-3xl font-bold">رؤية الخطوط</h1>
      </div>
      
      {fonts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm text-center p-8">
            <h3 className="text-2xl font-bold tracking-tight">لا توجد خطوط للعرض</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              ليس لديك أي خطوط بعد. ابدأ بإضافة بعض الخطوط من صفحة الرفع.
            </p>
            <Button asChild>
              <Link href="/upload">
                <PlusCircle className="ml-2 h-4 w-4" />
                أضف خطوط
              </Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {fonts.map((font) => (
            <ViewFontCard key={font.id} font={font} />
          ))}
        </div>
      )}
    </div>
  );
}
