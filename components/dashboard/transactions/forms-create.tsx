import { Field, FieldGroup } from "../../ui/field";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { TransactionTypes } from "@/modules/transactions/enums";
import { Response } from "@/modules/shared/Response";
import FieldFormInput from "@/components/ui/forms/field-form-Input";
import FieldFormSelect from "@/components/ui/forms/field-form-select";
import { cn } from "../../../lib/utils";
import FieldFormTextarea from "@/components/ui/forms/field-form-textarea";

const FormsCreate = ({
  state,
  className = "",
}: {
  state: Response;
  className?: string;
}) => {
  const parseToIdr = (value: string) => {
    if (!value) return "";
    const num = parseFloat(value.replace(/[^0-9]+/g, "")).toLocaleString(
      "id-ID",
    );
    return num;
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.name === "amount") {
      e.currentTarget.value = parseToIdr(e.currentTarget.value);
    }
  };

  const formatDatetimeLocal = (dateString : string) => {
    const date = dateString ? new Date(dateString) : new Date();
    const tzoffset = date.getTimezoneOffset() * 60000; // penyesuaian zona waktu lokal
    const localISOTime = new Date(date.getTime() - tzoffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  return (
    <FieldGroup className={cn("my-5", className)}>
      <div className="grid grid-cols-3 gap-3">
        <FieldFormInput
          label="Tanggal"
          id="date"
          name="date"
          type="datetime-local"
          placeholder="Tanggal"
          defaultValue={
            formatDatetimeLocal(state.values?.date || undefined)
          }
          errors={state?.errors?.date || null}
        />

        <FieldFormSelect
          label="Tipe"
          id="type"
          name="type"
          items={TransactionTypes}
          value={state.values?.type || TransactionTypes[0]?.value}
          errors={state?.errors?.type || null}
        />
        <FieldFormInput
          label="Kategori"
          id="category"
          name="category"
          type="text"
          placeholder="Kategori"
          defaultValue={state.values?.category || ""}
          errors={state?.errors?.category || null}
        />
      </div>
      <FieldFormInput
        prefixAddon="Rp"
        label="Jumlah"
        id="amount"
        name="amount"
        type="text"
        placeholder="0"
        defaultValue={
          state.values?.amount ? parseToIdr(state.values.amount.toString()) : ""
        }
        handleKeyUp={handleOnKeyUp}
        errors={state?.errors?.amount || null}
      />
      <FieldFormTextarea
        label="Deskripsi"
        id="description"
        name="description"
        placeholder="Deskripsi"
        defaultValue={state.values?.description || ""}
        errors={state?.errors?.description || null}
      />
    </FieldGroup>
  );
};

export default FormsCreate;
