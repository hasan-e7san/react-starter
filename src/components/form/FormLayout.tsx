import { useEffect, useMemo, useRef, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { ErrorBoundary } from "react-error-boundary";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card } from "../ui/card";
import { useToast } from "../ui/use-toast";
import useAxiosHeadersUrl from "../../lib/api/axios/hooks/useAxiosHeadersUrl";
import useAxiosAuth from "../../lib/api/axios/hooks/useAxiosAuth";
import { dateFromat, formatErrorToList } from "../../lib/utils";
import { FormContext, FormContextType } from "../../providers/FormContext";
import { useAccessControl } from "../../rbac/useAccessControl";
import { Action, CommonActions } from "../../rbac/access-rules";
import { useRouter } from "../../routes/hooks";
import SaveCloseButton from "./inputs/SaveCloseButton";

export interface FormLayoutProps<TFieldValues extends Record<string, any> = Record<string, any>> {
  item?: Partial<TFieldValues>;
  url: string;
  redirectUrl?: string;
  edit?: boolean;
  showCancelBtn?: boolean;
  showNewBtn?: boolean;
  onSave?: (data: any, mode: "add" | "edit") => void;
  onReset?: () => void;
  onError?: (error: unknown) => void;
  children?: React.ReactNode;
  resetForm?: boolean;
  validationSchema?: z.ZodType<TFieldValues>;
  requestHeaders?: Record<string, string>;
  dataFormatter?: Partial<Record<keyof TFieldValues | string, (data: any) => unknown>>;
  baseURL?: string;
  multipartUrls?: string[];
}

function createDynamicSchema(obj: Record<string, unknown>): z.ZodObject<any> {
  const schemaObject: Record<string, z.ZodTypeAny> = {};
  Object.keys(obj || {}).forEach((key) => {
    schemaObject[key] = z.any();
  });
  return z.object(schemaObject);
}

function formatDataV2(
  data: Record<string, any>,
  dataFormatter?: Record<string, (data: any) => any>
) {
  if (!dataFormatter) return data;

  const formData = new FormData();
  for (const key in data) {
    if (dataFormatter[key] !== undefined) {
      const newValue = dataFormatter[key](data[key]);
      if (newValue == null) continue;

      if (Array.isArray(newValue)) {
        newValue.forEach((val) => {
          formData.append(`${key}[]`, val as any);
        });
      } else {
        formData.append(key, newValue as any);
      }
    } else {
      formData.append(key, data[key] as any);
    }
  }
  return formData;
}

export default function FormLayout<TFieldValues extends Record<string, any> = Record<string, any>>({
  item,
  url,
  redirectUrl,
  edit = true,
  showCancelBtn = false,
  showNewBtn = true,
  onSave,
  onReset,
  onError,
  children,
  resetForm = false,
  validationSchema,
  requestHeaders,
  dataFormatter,
  baseURL = "",
  multipartUrls = [],
  }: FormLayoutProps<TFieldValues>) {
  const router = useRouter();
  const { toast } = useToast();
  const submitRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [itemState, setItemState] = useState(item);
  const [isCreate, setIsCreate] = useState(!item?.id);

  const axiosAuth = useAxiosAuth();
  const [apiUrl, headers] = useAxiosHeadersUrl(url, {
    baseURL,
    customHeaders: requestHeaders ?? {},
    multipartUrls,
  });

  const { isAllowed, getResourceByUrl } = useAccessControl();
  const action: Action = item?.id ? (edit ? CommonActions.Update : CommonActions.Read) : CommonActions.Create;
  const [isAllowedToShow, setIsAllowedToShow] = useState(true);

  useEffect(() => {
    setIsAllowedToShow(isAllowed(action, getResourceByUrl(url)));
  }, [action, getResourceByUrl, isAllowed, url]);

  const schema = validationSchema ?? createDynamicSchema((item as Record<string, unknown>) || {});

  const form = useForm<TFieldValues>({
    defaultValues: useMemo(() => (item ? (item as DefaultValues<TFieldValues>) : undefined), [item]),
    resolver: zodResolver(schema as z.ZodTypeAny),
  });

  const resetValues = () => {
    form.reset();
    setItemState(undefined);
    setIsCreate(true);
    if (onReset) onReset();
  };

  useEffect(() => {
    setItemState(item);
    if (item && Object.keys(item).length > 0) {
      Object.keys(form.getValues()).forEach((key) => {
        form.setValue(key as any, (item as Record<string, any>)[key] as any);
      });
    }
    setIsCreate(!item?.id);
  }, [item, form]);

  const submit = () => {
    submitRef.current?.requestSubmit();
  };

  const contextValue: FormContextType<TFieldValues> = {
    ...(form as any),
    errors: form.formState.errors,
    create: isCreate,
    edit,
    itemState,
    submit,
    reset: resetValues,
    formState: form.formState,
  };

  const onSubmit = form.handleSubmit(async (data, e) => {
    e?.preventDefault();
    setLoading(true);

    const payload = dataFormatter ? formatDataV2(data as Record<string, any>, dataFormatter as Record<string, any>) : data;

    if (isCreate) {
      const toastInstance = toast({ title: "Please wait ..." });
      try {
        const res = await axiosAuth.post(apiUrl, payload, headers as AxiosRequestConfig);
        if (redirectUrl && redirectUrl !== "#") {
          router.push(redirectUrl);
        }
        toast({
          title: res.data?.message ?? "Success",
          description: dateFromat(new Date()),
        });
        if (resetForm) resetValues();
        onSave?.(res.data?.data ?? res.data, "add");
      } catch (err) {
        onError?.(err);
        const message = (err as any)?.response?.data?.message || (err as any)?.message || "Something went wrong";
        form.setError("root" as any, { message: formatErrorToList(message) });
        toast({
          title: (err as any)?.response?.data?.error ?? "Request failed",
          description: dateFromat(new Date()),
          variant: "destructive",
        });
      } finally {
        toastInstance.dismiss();
        setLoading(false);
      }
      return;
    }

    if (edit) {
      const toastInstance = toast({ title: "Please wait ..." });
      try {
        const res = await axiosAuth.patch(`${apiUrl}/${(itemState as any)?.id}`, payload, headers as AxiosRequestConfig);
        toast({
          title: res.data?.message ?? "Success",
          description: dateFromat(new Date()),
        });
        onSave?.(res.data?.data ?? res.data, "edit");
        if (resetForm) resetValues();
      } catch (err) {
        onError?.(err);
        const message = (err as any)?.response?.data?.message || (err as any)?.message || "Something went wrong";
        form.setError("root" as any, { message: formatErrorToList(message) });
        toast({
          title: (err as any)?.response?.data?.error ?? "Request failed",
          description: dateFromat(new Date()),
          variant: "destructive",
        });
      } finally {
        toastInstance.dismiss();
        setLoading(false);
      }
    }
  });

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again.</div>}
      onError={(error) => {
        console.error("Form Error:", error);
        onError?.(error);
      }}
    >
      <FormContext.Provider value={contextValue}>
        <form onSubmit={onSubmit} ref={submitRef}>
          {isAllowedToShow ? (
            <div className={`rounded-md flex flex-col ${url === "/login" ? "h-[90vh]" : ""}`}>
              <div className="rounded-md bg-white dark:bg-stone-950 flex-1 overflow-auto p-4">
                <Card className="p-4">
                  {children}
                  {form.formState.errors.root && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: (form.formState.errors.root.message as string) ?? "",
                          }}
                        ></p>
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="p-4 bg-white dark:bg-stone-950 border-t sticky bottom-0 z-10">
                    <SaveCloseButton
                      showNewBtn={showNewBtn}
                      loading={loading}
                      showCancelBtn={showCancelBtn}
                      edit={edit}
                    />
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center font-bold w-full text-stone-600">Not Allowed</div>
          )}
        </form>
      </FormContext.Provider>
    </ErrorBoundary>
  );
}
