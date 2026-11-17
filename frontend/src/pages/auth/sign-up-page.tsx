import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import { SIGN_UP } from "@/graphql/auth";
import { errorCode, errorMessage } from "@/lib/errors";
import { AuthLayout } from "./auth-layout";
import { PasswordInput } from "./password-input";

// Mesmas regras do back-end (docs/04-contrato-graphql.md).
const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100, "O nome deve ter no máximo 100 caracteres"),
  email: z.string().trim().min(1, "Informe seu e-mail").email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function SignUpPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [mutate] = useMutation(SIGN_UP);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", password: "" } });

  async function onSubmit(input: FormValues) {
    try {
      const { data } = await mutate({ variables: { input } });
      if (data) {
        toast.dismiss();
        signIn(data.signUp);
        toast.success("Conta criada com sucesso!");
        navigate("/", { replace: true });
      }
    } catch (error) {
      if (errorCode(error) === "CONFLICT") {
        setError("email", { message: "E-mail já cadastrado" }, { shouldFocus: true });
      } else {
        toast.error(errorMessage(error));
      }
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      description="Comece a controlar suas finanças ainda hoje"
      footer={
        <>
          <span>Já tem uma conta?</span>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">
              <LogIn /> Fazer login
            </Link>
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Field label="Nome completo" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Seu nome completo"
            icon={<UserRound />}
            invalid={!!errors.name}
            aria-describedby={errors.name ? "name-message" : undefined}
            {...register("name")}
          />
        </Field>
        <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="mail@exemplo.com"
            icon={<Mail />}
            invalid={!!errors.email}
            aria-describedby={errors.email ? "email-message" : undefined}
            {...register("email")}
          />
        </Field>
        <Field
          label="Senha"
          htmlFor="password"
          error={errors.password?.message}
          hint="A senha deve ter no mínimo 8 caracteres"
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Digite sua senha"
            invalid={!!errors.password}
            aria-describedby="password-message"
            {...register("password")}
          />
        </Field>
        <Button type="submit" className="mt-2 w-full" loading={isSubmitting}>
          Cadastrar
        </Button>
      </form>
    </AuthLayout>
  );
}
