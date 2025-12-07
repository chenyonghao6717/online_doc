import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormFieldWrapperProps<T extends FieldValues> {
  name: Path<T>;
  type: string;
  placeholder: string;
  control: Control<T>;
}

export const FormFieldWrapper = <T extends FieldValues>({
  name,
  type,
  placeholder,
  control,
}: FormFieldWrapperProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
