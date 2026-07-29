export interface IFieldFormInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  errors?: string | null;
}