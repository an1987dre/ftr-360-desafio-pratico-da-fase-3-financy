import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TypeToggle } from "@/components/ui/type-toggle";
import { CATEGORIES } from "@/graphql/categories";
import { DATA_QUERIES } from "@/graphql/dashboard";
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from "@/graphql/transactions";
import type { Transaction } from "@/graphql/types";
import { errorMessage } from "@/lib/errors";
import { centsFromInput, dateInputToISO, formatDecimal, isoToDateInput, todayDateInput } from "@/lib/format";
import { CategorySelect } from "./category-select";

// Mesmas regras do back-end (docs/04-contrato-graphql.md).
const schema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().trim().min(1, "Informe a descrição").max(100, "A descrição deve ter no máximo 100 caracteres"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data"),
  amount: z.number().int().positive("Informe um valor maior que zero"),
  categoryId: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

type TransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Presente = modo edição (RF-F06); ausente = criação (RF-F04). */
  transaction?: Transaction | null;
};

function defaults(transaction?: Transaction | null): FormValues {
  return {
    type: transaction?.type ?? "EXPENSE",
    description: transaction?.description ?? "",
    date: transaction ? isoToDateInput(transaction.date) : todayDateInput(),
    amount: transaction?.amount ?? 0,
    categoryId: transaction?.category?.id ?? null,
  };
}

export function TransactionDialog({ open, onOpenChange, transaction }: TransactionDialogProps) {
  const editing = !!transaction;
  const { data: categoriesData } = useQuery(CATEGORIES, { skip: !open });
  const options = { refetchQueries: DATA_QUERIES, awaitRefetchQueries: true };
  const [create] = useMutation(CREATE_TRANSACTION, options);
  const [update] = useMutation(UPDATE_TRANSACTION, options);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: defaults(transaction) });

  useEffect(() => {
    if (open) reset(defaults(transaction));
  }, [open, transaction, reset]);

  async function onSubmit(values: FormValues) {
    const input = { ...values, date: dateInputToISO(values.date) };
    try {
      if (transaction) await update({ variables: { id: transaction.id, input } });
      else await create({ variables: { input } });
      toast.success(editing ? "Transação atualizada" : "Transação criada");
      onOpenChange(false);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={editing ? "Editar transação" : "Nova transação"}
        description="Registre sua despesa ou receita"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Controller
            control={control}
            name="type"
            render={({ field }) => <TypeToggle value={field.value} onChange={field.onChange} />}
          />

          <Field label="Descrição" htmlFor="transaction-description" error={errors.description?.message}>
            <Input
              id="transaction-description"
              placeholder="Ex. Almoço no restaurante"
              invalid={!!errors.description}
              aria-describedby={errors.description ? "transaction-description-message" : undefined}
              {...register("description")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data" htmlFor="transaction-date" error={errors.date?.message}>
              <Input
                id="transaction-date"
                type="date"
                invalid={!!errors.date}
                aria-describedby={errors.date ? "transaction-date-message" : undefined}
                {...register("date")}
              />
            </Field>
            <Field label="Valor" htmlFor="transaction-amount" error={errors.amount?.message}>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <Input
                    id="transaction-amount"
                    inputMode="numeric"
                    autoComplete="off"
                    icon={<span className="text-base text-gray-800">R$</span>}
                    value={formatDecimal(field.value)}
                    onChange={(event) => field.onChange(centsFromInput(event.target.value))}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    invalid={!!errors.amount}
                    aria-describedby={errors.amount ? "transaction-amount-message" : undefined}
                  />
                )}
              />
            </Field>
          </div>

          <Field label="Categoria" htmlFor="transaction-category">
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <CategorySelect
                  id="transaction-category"
                  value={field.value}
                  onChange={field.onChange}
                  categories={categoriesData?.categories ?? []}
                  noneLabel="Sem categoria"
                  placeholder="Selecione"
                />
              )}
            />
          </Field>

          <Button type="submit" className="mt-2 w-full" loading={isSubmitting}>
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
