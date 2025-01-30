import React, { useCallback, useRef, useState } from "react";

interface DragAndDropUploaderProps {
  onFilesUploaded: (files: FileList) => void;
}

const DragAndDropUploader: React.FC<DragAndDropUploaderProps> = ({
  onFilesUploaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        onFilesUploaded(event.dataTransfer.files);
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
        onFilesUploaded(event.target.files);
      }
    },
    [onFilesUploaded]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed p-6 rounded-lg h-24 flex items-center text-gray-400 justify-center w-full ${
        isDragging
          ? "border-blue-400 bg-blue-50 text-blue-400"
          : "border-gray-200"
      } hover:border-blue-400 hover:cursor-pointer hover:text-blue-400 hover:bg-blue-50`}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <p className="text-sm w-80 text-center">
        {isDragging
          ? "Drop the file here..."
          : "Drag & drop a file here, or click to select"}
      </p>
    </div>
  );
};

export default DragAndDropUploader;
