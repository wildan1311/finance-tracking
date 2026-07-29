import { Label } from "@/components/ui/label";
import { Field } from "../field";
import { useEffect, useState } from "react";
import { IFieldFormInput } from "@/modules/shared/IFieldFormInput";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../input-group";

interface FieldFormInputProps extends IFieldFormInput {
  prefixAddon?: React.ReactNode;
  suffixAddon?: React.ReactNode;
  handleKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => any;
  handleOnchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FieldFormInput = ({
  label,
  id,
  name,
  type,
  placeholder,
  defaultValue,
  prefixAddon,
  suffixAddon,
  errors,
  handleKeyUp = () => {},
  handleOnchange = () => {},
}: FieldFormInputProps) => {
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(errors)

  useEffect(() => {
    setError(errors);
  }, [errors]);

  const updateStateErrorWhenTyping = (status: boolean) => {
    setError(status ? errors : null);
    setTyping(status);
  }

  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <InputGroup>
        {prefixAddon && (
          <InputGroupAddon align={"inline-start"}>
            <InputGroupText>{prefixAddon}</InputGroupText>
          </InputGroupAddon>
        )}
        {suffixAddon && (
          <InputGroupAddon align={"inline-end"}>
            <InputGroupText>{suffixAddon}</InputGroupText>
          </InputGroupAddon>
        )}
        <InputGroupInput
          type={type}
          defaultValue={defaultValue}
          id={id}
          name={name}
          placeholder={placeholder}
          onFocus={() => updateStateErrorWhenTyping(true)}
          onBlur={() => updateStateErrorWhenTyping(false)}
          onKeyUp={handleKeyUp}
          onChange={handleOnchange}
        />
      </InputGroup>
      {error && !typing && <p className="text-sm text-red-500">{error}</p>}
    </Field>
  );
};

export default FieldFormInput;
