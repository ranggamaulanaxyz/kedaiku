import { cn, formatError, getFieldError } from "~/lib/utils";
import { Form, Link, useNavigation, useSubmit } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { CheckCheck } from "lucide-react";

export default function ResetPasswordRequestSent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex justify-center py-4">
            <CheckCheck className="h-16 w-16 animate-pulse rounded-full bg-emerald-500 text-white" />
          </div>
          <CardTitle>Reset Password Link Has Been Sent</CardTitle>
          <CardDescription>
            Silahkan cek email Anda dan ikuti instruksi untuk mereset password.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link to={"/"}>Back to Signin</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
