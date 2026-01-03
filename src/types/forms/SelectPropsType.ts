import { CustomInputProps } from "./InputPropsType";

export interface SelectOption {
  value: string | number;
  label: any;
  labelToView?: any;
}

export interface CustomSelectProps extends CustomInputProps {
  options?: SelectOption[];
  selected?: string;
  defaultItems?: any[];
  onTypeing?: (value: string) => void;
  otherOption?: string;
  itemsLoadingCallBack?: (key: string) => Promise<SelectOption[]>;
}

export interface LocalCustomSelectProps extends CustomInputProps {
  selected?: string;
  defaultItems?: any[];
}

export interface SelectItemType {
  id: number;
  title?: string;
  label?: string;
  name?: string;
  value?: string;
}
