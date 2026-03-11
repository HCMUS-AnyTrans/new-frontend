'use client';

import { useState, useCallback, useEffect } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { ZoomIn, ZoomOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AvatarCropModalProps {
  open: boolean;
  file: File | null;
  onSave: (cropArea: CroppedAreaPixels) => void;
  onCancel: () => void;
}

export function AvatarCropModal({
  open,
  file,
  onSave,
  onCancel,
}: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Create blob URL once per file, revoke when file changes or component unmounts
  useEffect(() => {
    if (!file) {
      setImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    // Reset crop state whenever a new file comes in
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleSave = () => {
    if (croppedAreaPixels) {
      onSave(croppedAreaPixels);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop your avatar</DialogTitle>
        </DialogHeader>

        {/* Crop canvas area */}
        <div className="relative h-72 w-full overflow-hidden rounded-lg bg-muted">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              classes={{
                containerClassName: 'rounded-lg',
              }}
            />
          )}
        </div>

        {/* Zoom control */}
        <div className="flex items-center gap-3 px-1">
          <ZoomOut className="size-4 shrink-0 text-muted-foreground" />
          <Slider
            min={1}
            max={3}
            step={0.05}
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            className="flex-1"
            aria-label="Zoom"
          />
          <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Drag to reposition · Scroll or use the slider to zoom
        </p>

        <DialogFooter className="gap-4 sm:gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!croppedAreaPixels}>
            Save avatar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
