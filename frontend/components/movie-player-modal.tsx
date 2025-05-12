"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MoviePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey?: string;
  autoembedUrl?: string;
  movieTitle: string;
}

export function MoviePlayerModal({ isOpen, onClose, videoKey, autoembedUrl, movieTitle }: MoviePlayerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] h-[80vh] p-0 bg-black border-gray-800">
        <DialogHeader className="absolute top-2 right-2 z-50">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </DialogHeader>
        {autoembedUrl ? (
          <div className="w-full h-full">
            <iframe
              src={autoembedUrl}
              title={movieTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : videoKey ? (
          <div className="w-full h-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title={movieTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white">No video available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}