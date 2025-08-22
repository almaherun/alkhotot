import AppLayout from "@/components/app-layout";
import { TryPage } from "@/components/try-page";
import { Suspense } from "react";

export default function TryRoute() {
  return (
    <AppLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <TryPage />
      </Suspense>
    </AppLayout>
  );
}
