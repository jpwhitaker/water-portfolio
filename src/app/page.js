'use client'

import { Canvas } from "@react-three/fiber"
import Experience from "./Experience.jsx"

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center">
      <Canvas>
        <Experience/>
      </Canvas>
    </main>
  )
}
