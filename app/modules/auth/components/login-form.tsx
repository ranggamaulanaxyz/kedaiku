import { cn, formatError, getFieldError } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Form, useNavigation } from "react-router";
import type { ValidationError, ValidationErrorDetails } from "~/types";
import {
  useEffect,
  useState,
  type FocusEvent,
  type SyntheticEvent,
} from "react";
import { SigninSchema } from "../schemas";
import { useClient } from "~/hooks/client";

type SigninValidationError = ValidationError<keyof SigninSchema>;

interface LoginFormProps extends React.ComponentProps<"div"> {
  initialFormErrors?: ValidationErrorDetails[];
  initialFieldError?: SigninValidationError;
}

export function LoginForm({
  className,
  initialFormErrors,
  initialFieldError,
  ...props
}: LoginFormProps) {
  const [formErrors, setFormErrors] = useState<ValidationErrorDetails[]>([]);
  const [fieldErrors, setFieldErrors] = useState<SigninValidationError>({});

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const { isMounted } = useClient();

  useEffect(() => {
    if (initialFormErrors) {
      setFormErrors(initialFormErrors);
    }
    if (initialFieldError) {
      setFieldErrors(initialFieldError);
    }
  }, [initialFormErrors, initialFieldError]);

  const validateField = async (key: keyof SigninSchema, value: string) => {
    const result = await SigninSchema.shape[key].safeParseAsync(value);
    if (result.success) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    } else {
      const errors = formatError<keyof SigninSchema>(result.error, key);
      setFieldErrors((prev) => ({
        ...prev,
        [key]: errors[key],
      }));
    }
  };

  const handleFieldBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "password") {
      validateField(name, value);
    }
  };

  const handleFormSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    console.log("masuk");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  disabled={isSubmitting}
                  aria-invalid={
                    !!(formErrors.length || fieldErrors.email?.length)
                  }
                  onBlur={handleFieldBlur}
                />
                <FieldError
                  errors={getFieldError<keyof SigninSchema>(
                    "email",
                    fieldErrors,
                  )}
                />
              </Field>
              <Field
                data-invalid={formErrors.length || fieldErrors.password?.length}
              >
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isSubmitting}
                  onBlur={handleFieldBlur}
                />
                <FieldError
                  errors={getFieldError<keyof SigninSchema>(
                    "password",
                    fieldErrors,
                  )}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
