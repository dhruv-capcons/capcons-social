"use client"

import { useEffect, useMemo, useRef } from "react"
import createGlobe, { COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

type GlobeArc = {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  color?: [number, number, number]
  arcSharpness?: number
}

type ExtendedCOBEOptions = COBEOptions & {
  arcs?: GlobeArc[]
}

const PRIMARY_COLOR: [number, number, number] = [127 / 255, 86 / 255, 217 / 255]

const NETWORK_ARCS: GlobeArc[] = [
  {
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 23.8103,
    endLng: 90.4125,
    color: PRIMARY_COLOR,
    arcSharpness: 0.4,
  },
  {
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 30.0444,
    endLng: 31.2357,
    color: PRIMARY_COLOR,
    arcSharpness: 0.4,
  },
  {
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 39.9042,
    endLng: 116.4074,
    color: PRIMARY_COLOR,
    arcSharpness: 0.4,
  },
  {
    startLat: 19.076,
    startLng: 72.8777,
    endLat: -23.5505,
    endLng: -46.6333,
    color: PRIMARY_COLOR,
    arcSharpness: 0.4,
  },
  {
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 40.7128,
    endLng: -74.006,
    color: PRIMARY_COLOR,
    arcSharpness: 0.4,
  },
  {
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 19.4326,
    endLng: -99.1332,
    color: PRIMARY_COLOR,
    arcSharpness: 0.4,
  },
  {
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 34.6937,
    endLng: 135.5022,
    color: PRIMARY_COLOR,
    arcSharpness: 0.4,
  },
  {
    startLat: 19.076,
    startLng: 72.8777,
    endLat: 41.0082,
    endLng: 28.9784,
    color: PRIMARY_COLOR,
    arcSharpness: 0.4,
  },
]

const GLOBE_CONFIG: ExtendedCOBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [...PRIMARY_COLOR],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.15 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
  arcs: NETWORK_ARCS,
}

export function Globe({
  className,
  config,
}: {
  className?: string
  config?: Partial<ExtendedCOBEOptions>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const widthRef = useRef(0)
  const phiRef = useRef(0)

  const finalConfig = useMemo<ExtendedCOBEOptions>(
    () => ({
      ...GLOBE_CONFIG,
      ...config,
    }),
    [config]
  )

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()
    // Set initial rotation to show India (approximately 77°E = 1.34 radians)
    phiRef.current = 1.34

    const globeConfig = {
      ...finalConfig,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      phi: phiRef.current,
      onRender: (state: {
        phi: number
        width: number
        height: number
      }) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.005
        }
        state.phi = phiRef.current + rs.get()
        const size = widthRef.current * 2
        state.width = size
        state.height = size
      },
    }

    // Ensure arcs are included if they exist - COBE may support arcs in some versions
    if (finalConfig.arcs && Array.isArray(finalConfig.arcs)) {
      ;(globeConfig as ExtendedCOBEOptions).arcs = finalConfig.arcs
    }

    const globe = createGlobe(canvasRef.current!, globeConfig as COBEOptions)

    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0)
    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, finalConfig])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
