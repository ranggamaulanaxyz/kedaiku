import { cn } from "~/lib/utils";
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
import { Form, useActionData, useNavigation } from "react-router";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const actionData = useActionData() as {
    error?: string;
    fieldErrors?: {
      email?: string[];
      password?: string[];
    };
  } | undefined;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const emailErrors = actionData?.fieldErrors?.email?.map((message) => ({ message }));
  const passwordErrors = actionData?.fieldErrors?.password?.map((message) => ({ message }));

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
          <Form method="post" className="flex flex-col gap-4">
            {actionData?.error && (
              <div
                role="alert"
                className="p-3 text-sm rounded bg-destructive/15 text-destructive font-medium border border-destructive/20"
              >
                {actionData.error}
              </div>
            )}
            <FieldGroup>
              <Field data-invalid={emailErrors && emailErrors.length > 0 ? "true" : undefined}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  disabled={isSubmitting}
                />
                <FieldError errors={emailErrors} />
              </Field>
              <Field data-invalid={passwordErrors && passwordErrors.length > 0 ? "true" : undefined}>
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
                />
                <FieldError errors={passwordErrors} />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button" disabled={isSubmitting}>
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
