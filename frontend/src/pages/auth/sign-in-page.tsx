import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, UserRoundPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import { SIGN_IN } from "@/graphql/auth";
import { errorCode, errorMessage } from "@/lib/errors";
import { AuthLayout } from "./auth-layout";
import { PasswordInput } from "./password-input";

const schema = z.object({
  email: z.string().trim().min(1, "Informe seu e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
  remember: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function SignInPage() {
  const { signIn } = useAuth();
  const [mutate] = useMutation(SIGN_IN);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "", remember: false } });

  async function onSubmit({ remember, ...input }: FormValues) {
    try {
      const { data } = await mutate({ variables: { input } });
      if (data) {
        toast.dismiss();
        signIn(data.signIn, remember);
      }
    } catch (error) {
      toast.error(errorCode(error) === "UNAUTHENTICATED" ? "E-mail ou senha inválidos" : errorMessage(error));
    }
  }

  return (
    <AuthLayout
      title="Fazer login"
      description="Entre na sua conta para continuar"
      footer={
        <>
          <span>Ainda não tem uma conta?</span>
          <Button asChild variant="outline" className="w-full">
            <Link to="/signup">
              <UserRoundPlus /> Criar conta
            </Link>
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
        <Field label="Senha" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            invalid={!!errors.password}
            aria-describedby={errors.password ? "password-message" : undefined}
            {...register("password")}
          />
        </Field>
        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              className="size-4 cursor-pointer rounded-sm border-gray-300 accent-brand-base"
              {...register("remember")}
            />
            Lembrar-me
          </label>
          <button
            type="button"
            className="font-medium text-brand-base underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
            onClick={() => toast.info("A recuperação de senha ainda não está disponível.")}
          >
            Recuperar senha
          </button>
        </div>
        <Button type="submit" className="mt-2 w-full" loading={isSubmitting}>
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
