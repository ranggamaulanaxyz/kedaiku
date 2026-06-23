import { Form, Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { ValidationError } from "~/types";
import type { ResetPasswordRequestSchema } from "../schemas";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

type ResetPasswordRequestError = ValidationError<
  keyof ResetPasswordRequestSchema
>;

interface ResetPasswordRequestFormProps {
  initialFieldErrors: ResetPasswordRequestError;
}

export default function ResetPasswordRequestForm({
  initialFieldErrors,
}: ResetPasswordRequestFormProps) {
  const [fieldErrors, setFieldErrors] =
    useState<ResetPasswordRequestError>(initialFieldErrors);

  useEffect(() => {
    if (initialFieldErrors) {
      setFieldErrors(initialFieldErrors);
    }
  }, [initialFieldErrors]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Reset Password Request</CardTitle>
          <CardDescription>
            Enter your email address to reset your password. We will send you a
            link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" name="email" required />
              </Field>
              <FieldGroup>
                <Button type="submit">Send Reset Link</Button>
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
