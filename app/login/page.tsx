"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { redirect, useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const otpSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
});

const otpVerificationSchema = z.object({
  otp: z.string().length(6, "O código OTP deve ter 6 dígitos"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type OtpVerificationFormData = z.infer<typeof otpVerificationSchema>;

export default function LoginPage() {
  const [formType, setFormType] = useState<
    "login" | "forgotPassword" | "resetPassword" | "otp" | "otpVerification"
  >("login");
  const searchParams = useSearchParams();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });
  const otpVerificationForm = useForm<OtpVerificationFormData>({
    resolver: zodResolver(otpVerificationSchema),
  });

  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [otpEmail, setOtpEmail] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data) {
        setUser(data.user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const access_token = searchParams.get("code");
    const type = searchParams.get("type");
    if (access_token && type === "recovery") {
      setFormType("resetPassword");
    }
  }, [searchParams]);

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const { data: signInData, error } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    }
  };

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/login?type=recovery`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Email de recuperação de senha enviado!");
        setFormType("login");
      }
    } catch (error) {
      toast.error("Erro ao enviar email de recuperação de senha");
    }
  };

  const onResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Senha atualizada com sucesso!");
        setFormType("login");
      }
    } catch (error) {
      toast.error("Erro ao atualizar a senha");
    }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Código OTP enviado para o seu email");
        setOtpEmail(data.email);
        setFormType("otpVerification");
      }
    } catch (error) {
      toast.error("Erro ao enviar OTP");
    }
  };

  const onOtpVerificationSubmit = async (data: OtpVerificationFormData) => {
    try {
      const { data: signInData, error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: data.otp,
        type: "email",
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Erro ao verificar OTP");
    }
  };

  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-center p-5">
            <h1 className="text-2xl font-bold">Akkar</h1>
          </CardHeader>
          <CardBody>
            <p className="text-center">
              Você já está logado como {user.email}.
            </p>
          </CardBody>
          <CardFooter className="flex gap-4 justify-center">
            <Button
              color="primary"
              onPress={async () => {
                await supabase.auth.signOut();
                setUser(null);
                window.location.reload();
              }}
            >
              Sair
            </Button>
            <Button color="secondary" onPress={() => router.push("/dashboard")}>
              Ir para o Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center p-5">
          <h1 className="text-2xl font-bold">Akkar</h1>
        </CardHeader>
        <CardBody>
          {formType === "login" && (
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <Input
                {...loginForm.register("email")}
                type="email"
                label="Email"
                placeholder="Digite seu email"
                isInvalid={loginForm.formState.errors.email !== undefined}
                errorMessage={loginForm.formState.errors.email?.message}
              />
              <Input
                {...loginForm.register("password")}
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
                isInvalid={loginForm.formState.errors.password !== undefined}
                errorMessage={loginForm.formState.errors.password?.message}
              />
              <div className="flex justify-between items-center">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={loginForm.formState.isSubmitting}
                >
                  Entrar
                </Button>
                <Button
                  color="secondary"
                  variant="light"
                  onPress={() => setFormType("forgotPassword")}
                >
                  Esqueci minha senha
                </Button>
              </div>
              <Button
                color="secondary"
                variant="light"
                onPress={() => setFormType("otp")}
                className="w-full"
              >
                Entrar com OTP
              </Button>
            </form>
          )}

          {formType === "forgotPassword" && (
            <form
              onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
              className="space-y-4"
            >
              <Input
                {...forgotPasswordForm.register("email")}
                type="email"
                label="Email"
                placeholder="Digite seu email para recuperação de senha"
                isInvalid={
                  forgotPasswordForm.formState.errors.email !== undefined
                }
                errorMessage={
                  forgotPasswordForm.formState.errors.email?.message
                }
              />
              <div className="flex justify-between items-center">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={forgotPasswordForm.formState.isSubmitting}
                >
                  Enviar email de recuperação
                </Button>
                <Button
                  color="secondary"
                  variant="light"
                  onPress={() => setFormType("login")}
                >
                  Voltar ao login
                </Button>
              </div>
            </form>
          )}

          {formType === "resetPassword" && (
            <form
              onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)}
              className="space-y-4"
            >
              <Input
                {...resetPasswordForm.register("password")}
                type="password"
                label="Nova Senha"
                placeholder="Digite sua nova senha"
                isInvalid={
                  resetPasswordForm.formState.errors.password !== undefined
                }
                errorMessage={
                  resetPasswordForm.formState.errors.password?.message
                }
              />
              <Input
                {...resetPasswordForm.register("confirmPassword")}
                type="password"
                label="Confirmar Nova Senha"
                placeholder="Confirme sua nova senha"
                isInvalid={
                  resetPasswordForm.formState.errors.confirmPassword !==
                  undefined
                }
                errorMessage={
                  resetPasswordForm.formState.errors.confirmPassword?.message
                }
              />
              <Button
                type="submit"
                color="primary"
                isLoading={resetPasswordForm.formState.isSubmitting}
              >
                Redefinir Senha
              </Button>
            </form>
          )}

          {formType === "otp" && (
            <form
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              className="space-y-4"
            >
              <Input
                {...otpForm.register("email")}
                type="email"
                label="Email"
                placeholder="Digite seu email para receber o código OTP"
                isInvalid={otpForm.formState.errors.email !== undefined}
                errorMessage={otpForm.formState.errors.email?.message}
              />
              <div className="flex justify-between items-center">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={otpForm.formState.isSubmitting}
                >
                  Enviar código OTP
                </Button>
                <Button
                  color="secondary"
                  variant="light"
                  onPress={() => setFormType("login")}
                >
                  Voltar ao login
                </Button>
              </div>
            </form>
          )}

          {formType === "otpVerification" && (
            <form
              onSubmit={otpVerificationForm.handleSubmit(
                onOtpVerificationSubmit
              )}
              className="flex flex-col gap-4 items-center space-y-4"
            >
              <InputOTP
                maxLength={6}
                containerClassName="group flex w-min items-center has-[:disabled]:opacity-30"
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                {...otpVerificationForm.register("otp")}
                onChange={(newValue: string) =>
                  otpVerificationForm.setValue("otp", newValue)
                }
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {otpVerificationForm.formState.errors.otp && (
                <p className="text-red-500 text-sm">
                  {otpVerificationForm.formState.errors.otp.message}
                </p>
              )}
              <Button
                type="submit"
                color="primary"
                isLoading={otpVerificationForm.formState.isSubmitting}
              >
                Verificar OTP
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
