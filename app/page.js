'use client';

import React, { useState, useRef } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const canvasRef = useRef(null);

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const convertToWebP = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    for (const file of files) {
      const imageUrl = URL.createObjectURL(file);
      const img = await loadImage(imageUrl);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/webp')
      );
      downloadWebP(blob, file.name.replace(/\.[^/.]+$/, '.webp'));

      URL.revokeObjectURL(imageUrl);
    }
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const downloadWebP = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Multiple Image to WebP Converter</h1>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />
      {files.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold">Selected files:</p>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <button 
        onClick={convertToWebP} 
        disabled={files.length === 0}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Convert to WebP and Download
      </button>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
