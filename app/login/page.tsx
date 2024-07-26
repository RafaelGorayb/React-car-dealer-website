"use client";
import React from "react";
import { z } from "zod";
import { Button, Input, Card, CardBody, CardHeader } from "@nextui-org/react";
import { login } from "./actions";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
  const [errors, setErrors] = React.useState<any>({});

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      loginSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });
      setErrors({});
      await login(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center p-5">
          <h1 className="text-2xl font-bold">Login</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              required
              errorMessage={errors.email?.[0]}
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
              errorMessage={errors.password?.[0]}
            />
            <div className="flex justify-center">
              <Button type="submit" color="primary">
                Log in
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
