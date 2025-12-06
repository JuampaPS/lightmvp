"use client";

import { useEffect, useState } from "react";
import { Loader } from "./Loader";

export function LoaderWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <Loader />;
}

