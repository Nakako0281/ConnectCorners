'use client';

import { useState } from "react";
import { Game } from "@/components/game/Game";
import { AssetLoader } from "@/components/game/AssetLoader";

export default function Home() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  return (
    <main className="min-h-screen">
      {!assetsLoaded && (
        <AssetLoader onLoadComplete={() => setAssetsLoaded(true)} />
      )}
      {assetsLoaded && <Game />}
    </main>
  );
}
