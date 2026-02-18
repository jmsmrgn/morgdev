import { useCallback, useEffect, useRef, useState } from 'react'
import { sequence, type Step } from '../data/sequence'

export type Line = { text: string; className?: string }

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

function buildFinalLines(steps: Step[]): Line[] {
  const lines: Line[] = [{ text: '' }]
  for (const step of steps) {
    if (step.type === 'type') {
      const last = lines[lines.length - 1]
      lines[lines.length - 1] = {
        text: last.text + step.text,
        className: step.className ?? last.className,
      }
    } else if (step.type === 'newline') {
      lines.push({ text: '' })
    }
  }
  return lines
}

export default function useTypewriter() {
  const linesRef = useRef<Line[]>([{ text: '' }])
  const [tick, setTick] = useState(0)
  const [done, setDone] = useState(false)
  const isMounted = useRef(true)
  const skipped = useRef(false)

  const skip = useCallback(() => {
    if (skipped.current) return
    skipped.current = true
    linesRef.current = buildFinalLines(sequence)
    if (isMounted.current) {
      setTick(t => t + 1)
      setDone(true)
    }
  }, [])

  useEffect(() => {
    const isCancelled = { current: false }
    isMounted.current = true
    skipped.current = false
    linesRef.current = [{ text: '' }]

    async function run() {
      for (const step of sequence) {
        if (isCancelled.current || skipped.current) return

        if (step.type === 'pause') {
          await sleep(step.ms)
          if (isCancelled.current) return
        } else if (step.type === 'newline') {
          if (isCancelled.current || skipped.current) return
          linesRef.current = [...linesRef.current, { text: '' }]
          if (!isCancelled.current && !skipped.current) setTick(t => t + 1)
        } else if (step.type === 'type') {
          // Apply className to the current line at the start of the step
          if (step.className !== undefined) {
            const lines = linesRef.current
            lines[lines.length - 1] = { ...lines[lines.length - 1], className: step.className }
            linesRef.current = [...lines]
          }
          for (const char of step.text) {
            if (isCancelled.current || skipped.current) return
            const lines = linesRef.current
            const last = lines[lines.length - 1]
            lines[lines.length - 1] = { ...last, text: last.text + char }
            linesRef.current = [...lines]
            if (!isCancelled.current && !skipped.current) setTick(t => t + 1)
            await sleep(step.speed)
            if (isCancelled.current) return
          }
        } else if (step.type === 'done') {
          if (!isCancelled.current && !skipped.current) setDone(true)
          return
        }
      }
    }

    run()

    return () => {
      isCancelled.current = true
      isMounted.current = false
    }
  }, [])

  return { lines: linesRef.current, done, skip }
}
