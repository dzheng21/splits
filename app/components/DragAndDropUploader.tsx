import React, { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";

interface DragAndDropUploaderProps {
  onFilesUploaded: (files: FileList) => Promise<void>;
}

const MAX_FILE_SIZE_MB = 10;
const TARGET_SIZE_MB = 1; // Target size after compression
const MAX_WIDTH_PX = 2048; // Max width to maintain quality

const DragAndDropUploader: React.FC<DragAndDropUploaderProps> = ({
  onFilesUploaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processImage = async (file: File): Promise<File> => {
    setError(null);

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      throw new Error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
    }

    try {
      // Dynamically import the required libraries
      const [imageCompression, { default: heic2any }] = await Promise.all([
        import("browser-image-compression"),
        import("heic2any"),
      ]);

      let processedFile = file;

      // Handle HEIC format
      if (
        file.type.toLowerCase().includes("heic") ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.type.toLowerCase().includes("heif") ||
        file.name.toLowerCase().endsWith(".heif")
      ) {
        console.log("Converting HEIC/HEIF to JPEG");
        const blob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });

        // Convert blob or blob array to File
        const jpegFile = Array.isArray(blob) ? blob[0] : blob;
        processedFile = new File(
          [jpegFile],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          {
            type: "image/jpeg",
          }
        );
      }

      // Compress the image
      const options = {
        maxSizeMB: TARGET_SIZE_MB,
        maxWidthOrHeight: MAX_WIDTH_PX,
        useWebWorker: true,
        fileType: "image/jpeg",
      };

      const compressedFile = await imageCompression.default(
        processedFile,
        options
      );
      return compressedFile;
    } catch (err) {
      console.error("Error processing image:", err);
      throw new Error("Failed to process image. Please try another file.");
    }
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const file = files[0];

      // Quick validation before proceeding
      if (
        !file.type.startsWith("image/") &&
        !file.name.toLowerCase().endsWith(".heic") &&
        !file.name.toLowerCase().endsWith(".heif")
      ) {
        throw new Error("Please upload an image file");
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        throw new Error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      }

      // Create a synthetic FileList with the original file for immediate upload
      const initialFileList = Object.create(FileList.prototype, {
        0: { value: file, enumerable: true },
        length: { value: 1, enumerable: true },
      });

      // Start the upload process immediately with the original file
      await onFilesUploaded(initialFileList as FileList);

      // Process the image in the background
      processImage(file)
        .then(async (processedFile) => {
          // Create a new FileList-like object with the processed file
          const container = new Blob([await processedFile.arrayBuffer()], {
            type: processedFile.type,
          });
          const finalFile = new File([container], processedFile.name, {
            type: processedFile.type,
            lastModified: new Date().getTime(),
          });

          // Create a synthetic FileList for the processed file
          const processedFileList = Object.create(FileList.prototype, {
            0: { value: finalFile, enumerable: true },
            length: { value: 1, enumerable: true },
          });

          // Upload the processed file
          await onFilesUploaded(processedFileList as FileList);
        })
        .catch((err) => {
          console.error("Background processing error:", err);
          // Don't set error since we've already moved on
        })
        .finally(() => {
          setIsProcessing(false);
        });
    } catch (err) {
      setError((err as Error).message);
      console.error("Error handling files:", err);
      setIsProcessing(false);
    }
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        handleFiles(event.dataTransfer.files);
      }
    },
    [onFilesUploaded]
  );

  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        handleFiles(event.target.files);
      }
    },
    [onFilesUploaded]
  );

  return (
    <div className="pl-4 pr-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed p-4 rounded-lg h-24 flex flex-col items-center justify-center w-full ${
          isDragging
            ? "border-blue-400 bg-blue-50 text-blue-400"
            : "border-gray-200"
        } hover:border-blue-400 hover:cursor-pointer hover:text-blue-400 hover:bg-blue-50 transition-all duration-200`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <p className="text-sm">Processing image...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-center">
              {isDragging
                ? "Drop the file here..."
                : "Drag & drop a receipt image here, or click to select"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports JPG, PNG, HEIC • Max {MAX_FILE_SIZE_MB}MB
            </p>
          </>
        )}
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-500 text-center">{error}</div>
      )}
    </div>
  );
};

export default DragAndDropUploader;
