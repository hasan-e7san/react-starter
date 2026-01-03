import { useContext, useEffect, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { AxiosInstance, AxiosProgressEvent } from "axios";
import { DeleteIcon, FileIcon, ImageIcon, XIcon } from "lucide-react";

import { Button } from "../../ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { createAuthAxiosInstance } from "../../../lib/api/axios";
import useAxiosAuth from "../../../lib/api/axios/hooks/useAxiosAuth";
import { FormContext } from "../../../providers/FormContext";

export type Attachment = {
  name: string;
  path: string;
  downloadUrl?: string;
};

export interface FileUploadProps {
  name: string;
  title: string;
  uploadUrl: string;
  downloadBaseUrl?: string;
  accept?: Accept;
  headers?: Record<string, string>;
  baseURL?: string;
  axiosInstance?: AxiosInstance;
  mapResponseToAttachment?: (response: any, file: File) => Attachment;
}

const defaultAccept: Accept = {
  "image/*": [".jpeg", ".jpg", ".png"],
};

export default function FileUpload({
  title,
  name,
  uploadUrl,
  downloadBaseUrl,
  accept = defaultAccept,
  headers,
  baseURL = "",
  axiosInstance,
  mapResponseToAttachment,
}: FileUploadProps) {
  const form = useContext(FormContext);
  const axiosAuth = useAxiosAuth({
    axiosInstance: axiosInstance ?? createAuthAxiosInstance({ baseURL }),
    customHeaders: headers,
  });

  const value = form?.watch(name);

  const [uploadedFiles, setUploadedFiles] = useState<Attachment[]>([]);
  const [uploadedFilesStatus, setUploadedFilesStatus] = useState<{
    [key: string]: { file: string; progress: number; error?: string };
  }>({});

  useEffect(() => {
    if (!form) return;
    const initValue = form.getValues(name);
    if (Array.isArray(initValue)) {
      const values = initValue.flatMap((item: any) => {
        if (typeof item === "object" && item?.path) {
          return [{ name: item.name ?? item.path, path: item.path, downloadUrl: item.downloadUrl }];
        }
        return [];
      });
      setUploadedFiles(values);
    } else {
      setUploadedFiles([]);
    }
  }, [form, name]);

  useEffect(() => {
    if (!form) return;
    if (Array.isArray(value)) {
      const values = value.flatMap((item: any) => {
        if (typeof item === "object" && item?.path) {
          return [{ name: item.name ?? item.path, path: item.path, downloadUrl: item.downloadUrl }];
        }
        return [];
      });
      setUploadedFiles(values);
    } else {
      setUploadedFiles([]);
    }
  }, [value, form]);

  const newUploadingFiles: { [key: string]: Attachment[] } = {};
  const uploadingFileStatusBuffer: {
    [key: string]: { file: string; progress: number; error?: string };
  } = {};

  function appendToUploadedFiles(uploadingKey: string, file: Attachment) {
    newUploadingFiles[uploadingKey].push(file);
    setUploadedFiles([...uploadedFiles, ...newUploadingFiles[uploadingKey]]);
    form?.setValue(name, [...uploadedFiles, ...newUploadingFiles[uploadingKey]] as any);
  }

  function initNewUploadingBuffer(uploadingKey: string) {
    newUploadingFiles[uploadingKey] = [];
  }

  function clearNewUploadingBuffer(uploadingKey: string) {
    delete newUploadingFiles[uploadingKey];
    setUploadedFiles([...uploadedFiles]);
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    onDrop: async (acceptedFiles: File[]) => {
      const uploadingKey = "" + Date.now() + Math.floor(Math.random() * 10000);
      initNewUploadingBuffer(uploadingKey);

      const uploadPromises = acceptedFiles.map(async (file: any) => {
        if (!uploadingFileStatusBuffer[file.path]) {
          uploadingFileStatusBuffer[file.path] = { file: file.path, progress: 0 };
          setUploadedFilesStatus({ ...uploadedFilesStatus, ...uploadingFileStatusBuffer });
        }
        try {
          const formData = new FormData();
          formData.append("file", file);
          const response = await axiosAuth.post(baseURL ? `${baseURL}${uploadUrl}` : uploadUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              ...headers,
            },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              const totalLength = progressEvent.total;

              if (totalLength) {
                const progressValue = Math.round((progressEvent.loaded * 100) / totalLength);

                if (!uploadingFileStatusBuffer[file.path]) {
                  uploadingFileStatusBuffer[file.path] = { file: file.path, progress: 0 };
                }
                uploadingFileStatusBuffer[file.path].progress = progressValue;
                setUploadedFilesStatus({ ...uploadedFilesStatus, ...uploadingFileStatusBuffer });
              }
            },
          });

          const attachement: Attachment = mapResponseToAttachment
            ? mapResponseToAttachment(response.data, file)
            : {
                name: response.data?.data?.attachement?.name ?? file.name,
                path: response.data?.data?.attachement?.path ?? response.data?.data?.path ?? response.data?.path ?? file.name,
                downloadUrl:
                  response.data?.data?.attachement?.downloadUrl ?? response.data?.data?.downloadUrl ?? response.data?.downloadUrl,
              };

          appendToUploadedFiles(uploadingKey, attachement);
          delete uploadingFileStatusBuffer[file.path];
          delete uploadedFilesStatus[file.path];
          setUploadedFilesStatus({ ...uploadedFilesStatus, ...uploadingFileStatusBuffer });
        } catch (error: any) {
          uploadingFileStatusBuffer[file.path].error = String(error);
        } finally {
        }
      });
      await Promise.all(uploadPromises);
      clearNewUploadingBuffer(uploadingKey);
    },
  });

  const deleteAttachment = (file: Attachment) => {
    const newUploadedFiles = uploadedFiles.filter((item) => item.path !== file.path);
    setUploadedFiles(newUploadedFiles);
    form?.setValue(name, newUploadedFiles as any);
  };

  function dropFileInprogress(file: string): void {
    delete uploadingFileStatusBuffer[file];
    delete uploadedFilesStatus[file];
    setUploadedFilesStatus({ ...uploadedFilesStatus, ...uploadingFileStatusBuffer });
  }

  return (
    <FormField
      control={form?.control}
      name={name}
      render={() => (
        <FormItem className="flex flex-col space-y-2 mb-2">
          <FormLabel>{title}</FormLabel>
          <FormControl>
            <div className="flex items-center flex-wrap">
              <div {...getRootProps({ className: "dropzone cursor-pointer" })}>
                <input {...getInputProps()} />
                <Button variant="outline" className="" type="button">
                  <FileIcon className="h-4 w-4" />
                  Add File
                </Button>
              </div>
              {uploadedFiles && !!uploadedFiles.length ? (
                uploadedFiles.map((item) => {
                  return (
                    <ImagePreview
                      key={item.path}
                      file={item}
                      deleteAttachment={deleteAttachment}
                      downloadBaseUrl={downloadBaseUrl ?? baseURL}
                    />
                  );
                })
              ) : (
                <span className="ml-2 text-sm text-muted-foreground"></span>
              )}

              {uploadedFilesStatus && Object.values(uploadedFilesStatus).length ? (
                Object.values(uploadedFilesStatus).map((item: any) => {
                  return (
                    <div key={item.file} className="border border-blue-700 flex items-center p-1 ml-2 rounded-lg ">
                      <span className="text-xs text-muted-foreground pr-2 min-w-28 w-32 overflow-hidden text-nowrap">
                        <span className="text-blue-800">{item.progress}%</span> {item.file.split("/")[1]}
                      </span>
                      {item.error && (
                        <span className="flex text-red-700 text-sm px-2">
                          {item.error} <DeleteIcon onClick={() => dropFileInprogress(item.file)} />
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                ""
              )}
            </div>
          </FormControl>

          <FormMessage className="h-auto min-h-2" />
        </FormItem>
      )}
    />
  );
}

function ImagePreview({
  file,
  deleteAttachment,
  downloadBaseUrl,
}: {
  file: Attachment;
  deleteAttachment: (file: Attachment) => void;
  downloadBaseUrl?: string;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = file.downloadUrl ?? (downloadBaseUrl ? `${downloadBaseUrl}/uploads/${file.path}` : file.path);
    setObjectUrl(url);
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [file, downloadBaseUrl]);

  const nameOriginal = file.name.split("/").pop();
  const Icon = objectUrl && isImage(file.name) ? ImageIcon : FileIcon;

  return (
    <div className="border border-teal-800 flex items-center p-1 ml-2 rounded-lg mt-1 mb-1 ">
      <Icon className=" h-5 w-5 object-cover text-teal-800 text-muted-foreground mr-1" />
      <XIcon className="cursor-pointer text-xs text-red-600 w-4 h-4 mr-2" onClick={() => deleteAttachment(file)} />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-muted-foreground pr-2 min-w-28 w-28 overflow-hidden text-nowrap">
              {nameOriginal}
            </span>
          </TooltipTrigger>
          <TooltipContent>{nameOriginal}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

const isImage = (filePath: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff"];
  const extension = filePath.split(".").pop();
  if (!extension) return false;
  return imageExtensions.includes(`.${extension.toLowerCase()}`);
};
