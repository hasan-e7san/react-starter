import { useContext } from "react";

import { Button } from "../../ui/button";
import { FormContext } from "../../../providers/FormContext";
import { ButtonProps } from "../../../types/forms/ButtonPropsType";

export default function SaveCloseButton({ loading, edit, showCancelBtn, showNewBtn, onClick }: ButtonProps) {
  const form = useContext(FormContext);

  const reset = form?.reset;

  return (
    <div className="m-2 flex justify-end gap-4">
      {showCancelBtn && (
        <Button
          type="button"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Button>
      )}

      {showNewBtn && (
        <Button
          type="button"
          variant={"outline"}
          onClick={() => reset?.()}
          className="flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
          disabled={loading}
          aria-disabled={loading}
        >
          New
        </Button>
      )}

      {edit && (
        <Button
          type="submit"
          onClick={onClick}
          className="flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? "please wait.." : "Submit"}
        </Button>
      )}
    </div>
  );
}
