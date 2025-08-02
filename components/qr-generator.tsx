"use client"

import { useEffect, useRef } from "react"

interface QRGeneratorProps {
  value: string
  size?: number
  className?: string
}

export function QRGenerator({ value, size = 200, className }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        canvas.width = size
        canvas.height = size

        // Detectar si está en dark mode
        const isDark = document.documentElement.classList.contains("dark")

        // Fondo adaptativo
        ctx.fillStyle = isDark ? "#1f2937" : "#FFFFFF"
        ctx.fillRect(0, 0, size, size)

        // Patrón QR adaptativo
        ctx.fillStyle = isDark ? "#FFFFFF" : "#000000"
        const squareSize = size / 20

        // Resto del código permanece igual...
        let seed = 0
        for (let i = 0; i < value.length; i++) {
          seed += value.charCodeAt(i)
        }

        for (let x = 0; x < 20; x++) {
          for (let y = 0; y < 20; y++) {
            const random = Math.sin(seed * x * y) * 10000
            if (random - Math.floor(random) > 0.5) {
              ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize)
            }
          }
        }

        // Esquinas de posicionamiento
        const cornerSize = squareSize * 3
        ctx.fillRect(0, 0, cornerSize, cornerSize)
        ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize)
        ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize)

        // Centros adaptativos en las esquinas
        ctx.fillStyle = isDark ? "#1f2937" : "#FFFFFF"
        const innerSize = squareSize
        ctx.fillRect(squareSize, squareSize, innerSize, innerSize)
        ctx.fillRect(size - cornerSize + squareSize, squareSize, innerSize, innerSize)
        ctx.fillRect(squareSize, size - cornerSize + squareSize, innerSize, innerSize)
      }
    }
  }, [value, size])

  return <canvas ref={canvasRef} className={className} />
}
