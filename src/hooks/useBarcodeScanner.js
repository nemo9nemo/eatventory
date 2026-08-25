import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'

/**
 * Encapsulates camera access + live barcode decoding so it can be unit/E2E
 * tested independently from AddIngredientModal (mock this hook to simulate
 * scan results without a real camera).
 *
 * @param {{ onDetected?: (barcodeText: string) => void }} options
 * @returns {{
 *   videoRef: import('react').RefObject<HTMLVideoElement>,
 *   status: 'idle' | 'requesting' | 'scanning' | 'denied' | 'error',
 *   start: () => Promise<void>,
 *   stop: () => void,
 * }}
 */
export function useBarcodeScanner({ onDetected } = {}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const controlsRef = useRef(null)
  const readerRef = useRef(null)
  const [status, setStatus] = useState('idle')

  const stopStream = useCallback(() => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop()
      } catch {
        // ignore — controls may already be stopped
      }
      controlsRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const stop = useCallback(() => {
    stopStream()
    setStatus('idle')
  }, [stopStream])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      setStatus('error')
      return
    }

    setStatus('requesting')

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    } catch (err) {
      setStatus(err && err.name === 'NotAllowedError' ? 'denied' : 'error')
      return
    }

    streamRef.current = stream

    if (!videoRef.current) {
      stream.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setStatus('error')
      return
    }

    try {
      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader()
      }
      setStatus('scanning')

      const controls = await readerRef.current.decodeFromStream(
        stream,
        videoRef.current,
        (result, _err, ctrls) => {
          if (result) {
            controlsRef.current = ctrls
            stopStream()
            setStatus('idle')
            onDetected?.(result.getText())
          }
        }
      )
      controlsRef.current = controls
    } catch {
      stopStream()
      setStatus('error')
    }
  }, [onDetected, stopStream])

  // Always release the camera on unmount, even if the caller forgets to stop().
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])

  return { videoRef, status, start, stop }
}
