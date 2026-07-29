import { IFieldFormInput } from "@/modules/shared/IFieldFormInput";
import { Field } from "../field";
import { Label } from "../label";
import { Textarea } from "../textarea";
import { useEffect, useState } from "react";

const FieldFormTextarea = ({
  label,
  id,
  name,
  placeholder,
  defaultValue,
  errors,
}: IFieldFormInput) => {
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
      <Textarea
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="min-h-30"
        onFocus={() => updateStateErrorWhenTyping(true)}
        onBlur={() => updateStateErrorWhenTyping(false)}
      />
      {error && !typing && <p className="text-sm text-red-500">{error}</p>}
    </Field>
  );
};

export default FieldFormTextarea;
