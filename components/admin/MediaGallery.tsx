'use client'

import { useState } from 'react'
import { X, ZoomIn, ImageIcon, Video as VideoIcon } from 'lucide-react'
import { RequestMedia } from '@/types'

export function MediaGallery({ media }: { media: RequestMedia[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  const productPhotos = media.filter((m) => m.file_type === 'product_photo')
  const issuePhotos = media.filter((m) => m.file_type === 'issue_photo')
  const videos = media.filter((m) => m.file_type === 'video')

  const PhotoGrid = ({ items, label }: { items: RequestMedia[]; label: string }) => (
    items.length > 0 ? (
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setLightbox(item.file_url)}
              className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200 hover:border-red-300 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.file_url}
                alt={item.file_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>
    ) : null
  )

  if (media.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No media uploaded</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PhotoGrid items={productPhotos} label="Panel / Product Photos" />
      <PhotoGrid items={issuePhotos} label="Issue Photos" />

      {videos.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Videos</p>
          <div className="space-y-2">
            {videos.map((v) => (
              <div key={v.id} className="rounded-lg overflow-hidden border border-gray-200">
                <video
                  src={v.file_url}
                  controls
                  className="w-full max-h-64 bg-black"
                />
                <div className="flex items-center gap-2 p-2 bg-gray-50">
                  <VideoIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600 truncate">{v.file_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
