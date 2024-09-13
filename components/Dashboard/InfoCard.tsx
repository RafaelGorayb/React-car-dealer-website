import React from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';

interface InfoCardProps {
  title: string;
  value: number | string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="text-lg font-bold">{title}</CardHeader>
      <CardBody>
        <h2 className="text-2xl font-semibold">{value}</h2>
      </CardBody>
    </Card>
  );
};

export default InfoCard;
