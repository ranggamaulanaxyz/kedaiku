import { cn, formatError, getFieldError } from "~/lib/utils";
import { Form, Link, useNavigation, useSubmit } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { ValidationError, ValidationErrorDetails } from "~/types";
import { ResetPasswordSchema } from "../schemas";
import {
  useEffect,
  useState,
  type FocusEvent,
  type SyntheticEvent,
} from "react";
import { Button } from "~/components/ui/button";
import { useClient } from "~/hooks/client";
import { success } from "zod";
import { toast } from "sonner";

type ResetPasswordError = ValidationError<keyof ResetPasswordSchema>;

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  isUpdated: boolean;
  initialFieldErrors?: ResetPasswordError;
  initialFormErrors?: ValidationErrorDetails[];
}

export default function ResetPasswordForm({
  className,
  isUpdated,
  initialFieldErrors,
  initialFormErrors,
  ...props
}: ResetPasswordFormProps) {
  const [formErrors, setFormErrors] = useState<ValidationErrorDetails[]>([]);
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordError>({});

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const { isMounted } = useClient();

  const submit = useSubmit();

  useEffect(() => {
    if (initialFormErrors) {
      setFormErrors(initialFormErrors);
    }
    if (initialFieldErrors) {
      setFieldErrors(initialFieldErrors);
    }
  }, [initialFormErrors, initialFieldErrors]);

  useEffect(() => {
    if (isUpdated) {
      toast.success("Your password has been updated");
    }
  }, [isUpdated]);

  const validateField = async (
    key: keyof ResetPasswordSchema,
    value: string,
    formData?: FormData,
  ) => {
    if (key === "password") {
      const result =
        await ResetPasswordSchema.shape.password.safeParseAsync(value);
      if (result.success) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.password;
          return newErrors;
        });
      } else {
        const errors = formatError<keyof ResetPasswordSchema>(
          result.error,
          "password",
        );
        setFieldErrors((prev) => ({
          ...prev,
          password: errors.password,
        }));
      }
    } else if (key === "password_confirmation" && formData) {
      const password = formData.get("password") as string;
      const result = await ResetPasswordSchema.safeParseAsync({
        password,
        password_confirmation: value,
      });
      if (result.success) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.password_confirmation;
          return newErrors;
        });
      } else {
        const errors = formatError<keyof ResetPasswordSchema>(result.error);
        if (errors.password_confirmation) {
          setFieldErrors((prev) => ({
            ...prev,
            password_confirmation: errors.password_confirmation,
          }));
        } else {
          setFieldErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.password_confirmation;
            return newErrors;
          });
        }
      }
    }
  };

  const handleFieldBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const form = e.target.form;
    if (name === "password" || name === "password_confirmation") {
      validateField(
        name as keyof ResetPasswordSchema,
        value,
        form ? new FormData(form) : undefined,
      );
    }
  };

  const handleFormSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    const formData = new FormData(currentTarget);
    const password = formData.get("password") as string;
    const password_confirmation = formData.get(
      "password_confirmation",
    ) as string;

    const result = await ResetPasswordSchema.safeParseAsync({
      password,
      password_confirmation,
    });
    if (result.success) {
      submit(currentTarget);
    } else {
      const errors = formatError<keyof ResetPasswordSchema>(result.error);
      setFieldErrors(errors);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            method="post"
            className="flex flex-col gap-4"
            noValidate={isMounted}
            onSubmit={handleFormSubmit}
          >
            <FieldGroup>
              <Field
                data-invalid={
                  !!(formErrors.length || fieldErrors.password?.length)
                }
              >
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                  aria-invalid={
                    !!(formErrors.length || fieldErrors.password?.length)
                  }
                  onBlur={handleFieldBlur}
                />
                <FieldError
                  errors={getFieldError<keyof ResetPasswordSchema>(
                    "password",
                    fieldErrors,
                  )}
                />
              </Field>

              <Field
                data-invalid={
                  !!(
                    formErrors.length ||
                    fieldErrors.password_confirmation?.length
                  )
                }
              >
                <FieldLabel htmlFor="password_confirmation">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                  aria-invalid={
                    !!(
                      formErrors.length ||
                      fieldErrors.password_confirmation?.length
                    )
                  }
                  onBlur={handleFieldBlur}
                />
                <FieldError
                  errors={getFieldError<keyof ResetPasswordSchema>(
                    "password_confirmation",
                    fieldErrors,
                  )}
                />
              </Field>

              <FieldGroup>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
                <Button variant="outline" asChild>
                  <Link to={"/"}>Back to Signin</Link>
                </Button>
              </FieldGroup>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
