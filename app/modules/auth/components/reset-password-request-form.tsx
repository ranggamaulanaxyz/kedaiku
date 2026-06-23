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
import { ResetPasswordRequestSchema } from "../schemas";
import {
  useEffect,
  useState,
  type FocusEvent,
  type SyntheticEvent,
} from "react";
import { Button } from "~/components/ui/button";
import { useClient } from "~/hooks/client";

type ResetPasswordRequestError = ValidationError<
  keyof ResetPasswordRequestSchema
>;

interface ResetPasswordRequestFormProps extends React.ComponentProps<"div"> {
  initialFieldErrors?: ResetPasswordRequestError;
  initialFormErrors?: ValidationErrorDetails[];
}

export default function ResetPasswordRequestForm({
  className,
  initialFieldErrors,
  initialFormErrors,
  ...props
}: ResetPasswordRequestFormProps) {
  const [formErrors, setFormErrors] = useState<ValidationErrorDetails[]>([]);
  const [fieldErrors, setFieldErrors] = useState<ResetPasswordRequestError>({});

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

  const validateField = async (
    key: keyof ResetPasswordRequestSchema,
    value: string,
  ) => {
    const result = await ResetPasswordRequestSchema.shape[key].safeParseAsync(
      value,
    );
    if (result.success) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    } else {
      const errors = formatError<keyof ResetPasswordRequestSchema>(
        result.error,
        key,
      );
      setFieldErrors((prev) => ({
        ...prev,
        [key]: errors[key],
      }));
    }
  };

  const handleFieldBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      validateField(name, value);
    }
  };

  const handleFormSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    const formData = new FormData(currentTarget);
    const email = formData.get("email") as string;

    const result = await ResetPasswordRequestSchema.safeParseAsync({ email });
    if (result.success) {
      submit(currentTarget);
    } else {
      const errors = formatError<keyof ResetPasswordRequestSchema>(result.error);
      setFieldErrors(errors);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset Password Request</CardTitle>
          <CardDescription>
            Enter your email address to reset your password. We will send you a
            link
          </CardDescription>
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
                  !!(formErrors.length || fieldErrors.email?.length)
                }
              >
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  required
                  disabled={isSubmitting}
                  aria-invalid={
                    !!(formErrors.length || fieldErrors.email?.length)
                  }
                  onBlur={handleFieldBlur}
                />
                <FieldError
                  errors={getFieldError<keyof ResetPasswordRequestSchema>(
                    "email",
                    fieldErrors,
                  )}
                />
              </Field>
              <FieldGroup>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
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

