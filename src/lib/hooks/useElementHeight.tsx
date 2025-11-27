import { useCallback, useLayoutEffect, useRef, useState } from "react"

export function useElementHeight<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [height, setHeight] = useState(0)

  const setRef = useCallback((node: T | null) => {
    ref.current = node
    if (node) setHeight(node.offsetHeight)
  }, [])

  useLayoutEffect(() => {
    if (!ref.current) return
    const node = ref.current

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === node) {
          setHeight(entry.contentRect.height)
        }
      }
    })
    resizeObserver.observe(node)
    return () => resizeObserver.disconnect()
  }, [])

  return [setRef, { height }] as const
}
