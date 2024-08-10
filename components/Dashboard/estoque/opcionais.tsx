import React, { useState } from "react";
import { Input, Button, Chip, Card, CardBody } from "@nextui-org/react";

interface OpcionaisTabProps {
  opcionais: string[];
  setOpcionais: React.Dispatch<React.SetStateAction<string[]>>;
}

const OpcionaisTab = ({ opcionais, setOpcionais }: OpcionaisTabProps) => {
  const [novoOpcional, setNovoOpcional] = useState("");

  const adicionarOpcional = () => {
    if (novoOpcional.trim()) {
      setOpcionais([...opcionais, novoOpcional.trim()]);
      setNovoOpcional("");
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="flex gap-2 mb-4">
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
          />
          <Button onClick={adicionarOpcional}>Adicionar</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {opcionais.map((opcional, index) => (
            <Chip
              key={index}
              onClose={() =>
                setOpcionais(opcionais.filter((_, i) => i !== index))
              }
            >
              {opcional}
            </Chip>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default OpcionaisTab;
