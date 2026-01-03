import * as React from "react";
import { useRef } from "react";

import { Button, ButtonProps } from "../ui/button";
import { useToast } from "../ui/use-toast";

export interface FileUploadButtonProps extends Omit<ButtonProps, "onChange"> {
  onFileSelect?: (file: File) => void;
  accept?: string;
  validationRules?: {
    maxSize?: number; // in bytes
    acceptedTypes?: string[];
    customValidation?: (file: File) => boolean | string;
  };
  children?: React.ReactNode;
}

const FileUploadButton = React.forwardRef<HTMLButtonElement, FileUploadButtonProps>(
  (
    {
      onFileSelect,
      accept = "*/*",
      validationRules = {
        maxSize: 5 * 1024 * 1024, // 5MB default
        acceptedTypes: undefined,
      },
      children,
      ...buttonProps
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const validateFile = (file: File): boolean => {
      if (validationRules.maxSize && file.size > validationRules.maxSize) {
        const sizeMB = validationRules.maxSize / (1024 * 1024);
        toast({
          title: "File too large",
          description: `File size should be less than ${sizeMB}MB`,
          variant: "destructive",
        });
        return false;
      }

      if (validationRules.acceptedTypes && validationRules.acceptedTypes.length > 0) {
        if (!validationRules.acceptedTypes.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `Please select: ${validationRules.acceptedTypes.join(", ")}`,
            variant: "destructive",
          });
          return false;
        }
      }

      if (validationRules.customValidation) {
        const customValidationResult = validationRules.customValidation(file);
        if (typeof customValidationResult === "string") {
          toast({ title: "File validation failed", description: customValidationResult, variant: "destructive" });
          return false;
        }
        if (!customValidationResult) {
          toast({ title: "File validation failed", variant: "destructive" });
          return false;
        }
      }

      return true;
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (validateFile(file)) {
        onFileSelect?.(file);
        toast({ title: "File selected", description: file.name });
      }

      event.target.value = "";
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      fileInputRef.current?.click();
      buttonProps.onClick?.(event);
    };

    return (
      <div className="flex flex-col items-center">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
        <Button {...buttonProps} onClick={handleClick} ref={ref}>
          {children}
        </Button>
      </div>
    );
  }
);

FileUploadButton.displayName = "FileUploadButton";

export { FileUploadButton };
