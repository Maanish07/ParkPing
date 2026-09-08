'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
}

export default function QRCodeCanvas({
  value,
  size = 200,
  fgColor = '#000000',
  bgColor = '#ffffff',
  className = '',
  level = 'M',
}: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 1,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: level,
      },
      (error) => {
        if (error) console.error('QR Code Generation Error:', error);
      }
    );
  }, [value, size, fgColor, bgColor, level]);

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-lg ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
