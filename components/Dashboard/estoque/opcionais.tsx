import React, { useState } from "react";
import { Input, Button, Chip, Card, CardBody, Divider } from "@nextui-org/react";

interface OpcionaisTabProps {
  opcionais: string[];
  setOpcionais: React.Dispatch<React.SetStateAction<string[]>>;
}

// Common optional features for vehicles to help users
const commonOptionals = [
  "Ar condicionado",
  "Direção hidráulica",
  "Vidros elétricos",
  "Travas elétricas",
  "Alarme",
  "Airbag",
  "Freios ABS",
  "Sensor de estacionamento",
  "Câmera de ré",
  "Bancos em couro",
  "Teto solar",
  "Rodas de liga leve",
  "Piloto automático",
  "Bluetooth",
  "Central multimídia",
];

const OpcionaisTab = ({ opcionais, setOpcionais }: OpcionaisTabProps) => {
  const [novoOpcional, setNovoOpcional] = useState("");

  const adicionarOpcional = () => {
    if (novoOpcional.trim() && !opcionais.includes(novoOpcional.trim())) {
      setOpcionais([...opcionais, novoOpcional.trim()]);
      setNovoOpcional("");
    }
  };

  const adicionarComum = (opcional: string) => {
    if (!opcionais.includes(opcional)) {
      setOpcionais([...opcionais, opcional]);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardBody className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary">Adicionar Opcionais</h3>
          <Divider className="mb-4" />
          
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <Input
              label="Novo item opcional"
              placeholder="Digite um item opcional"
              value={novoOpcional}
              onChange={(e) => setNovoOpcional(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionarOpcional();
                }
              }}
              className="flex-grow"
            />
            <Button 
              onClick={adicionarOpcional}
              color="primary"
              className="md:self-end"
            >
              Adicionar
            </Button>
          </div>
          
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">Opcionais selecionados:</h4>
            <div className="flex flex-wrap gap-2 min-h-[50px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
              {opcionais.length > 0 ? (
                opcionais.map((opcional, index) => (
                  <Chip
                    key={index}
                    onClose={() =>
                      setOpcionais(opcionais.filter((_, i) => i !== index))
                    }
                    variant="flat"
                    color="primary"
                    className="text-sm"
                  >
                    {opcional}
                  </Chip>
                ))
              ) : (
                <p className="text-gray-500 text-sm p-2">Nenhum opcional selecionado</p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      
      <Card className="shadow-sm">
        <CardBody className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-primary">Opcionais Comuns</h3>
          <Divider className="mb-4" />
          <p className="text-sm text-gray-500 mb-4">Clique para adicionar rapidamente:</p>
          
          <div className="flex flex-wrap gap-2">
            {commonOptionals.map((opcional) => (
              <Chip
                key={opcional}
                onClick={() => adicionarComum(opcional)}
                variant="flat"
                color={opcionais.includes(opcional) ? "success" : "default"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                {opcional}
                {opcionais.includes(opcional) && " ✓"}
              </Chip>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OpcionaisTab;
