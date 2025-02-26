import React from "react";
import { Controller } from "react-hook-form";
import { Input, Select, SelectItem, Card, CardBody, Divider } from "@nextui-org/react";
import { z } from "zod";
import { carSchema, CarFormData } from "./schema";

// Group fields into logical sections with proper typing
interface FieldGroups {
  basicInfo: string[];
  yearInfo: string[];
  engineInfo: string[];
  chassisInfo: string[];
  comfortInfo: string[];
  outros?: string[]; // Make this optional
  [key: string]: string[] | undefined; // Allow for dynamic properties
}

const fieldGroups: FieldGroups = {
  basicInfo: ["marca", "modelo", "versao", "cor", "preco", "km", "final_placa"],
  yearInfo: ["ano_fabricacao", "ano_modelo"],
  engineInfo: ["motorizacao", "motor", "potencia", "torque"],
  chassisInfo: ["carroceria", "tracao", "cambio", "rodas", "freios", "direcao"],
  comfortInfo: ["bancos", "ar_condicionado", "farol", "multimidia", "airbag"],
};

// Get all fields that are not in any group
const allFields = Object.keys(carSchema.shape);
const groupedFields = Object.values(fieldGroups).flat();
const otherFields = allFields.filter(field => !groupedFields.includes(field));

// Add remaining fields to a miscellaneous group if any exist
if (otherFields.length > 0) {
  fieldGroups.outros = otherFields;
}

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
            className="w-full"
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
            className="w-full"
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
            className="w-full"
          />
        )}
      />
    );
  }
};

// Section titles with translations
interface SectionTitles {
  basicInfo: string;
  yearInfo: string;
  engineInfo: string;
  chassisInfo: string;
  comfortInfo: string;
  outros: string;
  [key: string]: string;
}

const sectionTitles: SectionTitles = {
  basicInfo: "Informações Básicas",
  yearInfo: "Ano",
  engineInfo: "Motor e Desempenho",
  chassisInfo: "Chassi e Transmissão",
  comfortInfo: "Conforto e Equipamentos",
  outros: "Outros Detalhes",
};

const EspecificacoesForm = ({ control, errors }: { control: any; errors: any }) => {
  return (
    <div className="space-y-6">
      {Object.entries(fieldGroups).map(([groupKey, fields]) => (
        fields && fields.length > 0 ? (
          <Card key={groupKey} shadow="sm" className="">
            <CardBody className="p-6">
              <h3 className="text-xl font-semibold mb-4 ">
                {sectionTitles[groupKey] || formatFieldName(groupKey)}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {fields.map((fieldName) => (
                  <div key={fieldName} className="w-full">
                    {renderFormField(
                      fieldName as keyof CarFormData,
                      formatFieldName(fieldName),
                      control,
                      errors
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ) : null
      ))}
    </div>
  );
};

export default EspecificacoesForm;
