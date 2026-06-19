"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function LocaleDocumentSync() {
  const pathname = usePathname();

  React.useEffect(() => {
    document.documentElement.lang = pathname.startsWith("/th") ? "th" : "en";
  }, [pathname]);

  return null;
}
