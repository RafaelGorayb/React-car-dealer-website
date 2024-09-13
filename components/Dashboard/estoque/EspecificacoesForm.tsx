import React from "react";
import { Controller } from "react-hook-form";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { z } from "zod";
import { carSchema } from "./CarForm";

type CarFormData = z.infer<typeof carSchema>;

const formatFieldName = (fieldName: string) => {
  return fieldName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};



const renderFormField = (
  fieldName: keyof CarFormData,
  label: string,
  control: any,
  errors: any
) => {
  const fieldSchema = carSchema.shape[fieldName];
  
  if (fieldSchema instanceof z.ZodNumber) {
    return (
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            label={label}
            placeholder={`Digite ${label}`}
            isInvalid={!!errors[fieldName]}
            errorMessage={errors[fieldName]?.message}
          />
        )}
      />
    );
  } else if (fieldSchema instanceof z.ZodEnum) {
    const options = (fieldSchema as any)._def.values;
    return (
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Select
            label={label}
            placeholder={`Selecione ${label}`}
            isInvalid={!!errors[fieldName]}
            errorMessage={errors[fieldName]?.message}
            selectedKeys={field.value ? new Set([field.value]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys).join("");
              field.onChange(selectedValue);
            }}
          >
            {options.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
        )}
      />
    );
  } else {
    return (
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label={label}
            placeholder={`Digite ${label}`}
            isInvalid={!!errors[fieldName]}
            errorMessage={errors[fieldName]?.message}
          />
        )}
      />
    );
  }
};


const EspecificacoesForm = ({ control, errors }: { control: any; errors: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.keys(carSchema.shape).map((fieldName) => (
        <div key={fieldName}>
          {renderFormField(
            fieldName as keyof CarFormData,
            formatFieldName(fieldName),
            control,
            errors
          )}
        </div>
      ))}
    </div>
  );
};

export default EspecificacoesForm;
