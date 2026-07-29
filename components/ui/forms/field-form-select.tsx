import { ReactNode, useEffect, useState } from "react";
import { Field } from "../field";
import { Label } from "../label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { IFieldFormInput } from "@/modules/shared/IFieldFormInput";

export interface SelectOption {
  label: ReactNode;
  value: any;
}

export interface FieldFormSelectProps extends IFieldFormInput {
  items: SelectOption[];
  value: any;
}

const FieldFormSelect = ({
  label,
  id,
  name,
  items,
  value,
  errors,
}: FieldFormSelectProps) => {
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(errors);

  useEffect(() => {
      setError(errors);
    }, [errors]);

  const updateStateErrorWhenTyping = (status: boolean) => {
    setError(status ? errors : null);
    setTyping(status);
  };

  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Select items={items} defaultValue={value} name={name} id={id} onOpenChange={() => updateStateErrorWhenTyping(true)}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {items.map((item: any) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && !typing && <p className="text-sm text-red-500">{error}</p>}
    </Field>
  );
};

export default FieldFormSelect;
