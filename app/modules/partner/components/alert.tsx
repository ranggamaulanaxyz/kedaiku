import type React from "react";
import type { Blocker } from "react-router";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

interface ButtonWithAlertProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

function ButtonWithAlert({
  children,
  title,
  description,
  onClick,
  ...props
}: ButtonWithAlertProps & React.ComponentProps<typeof Button>) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...props}>{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Lanjut</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface BlockerAlertProps {
  title?: string;
  description?: string;
  blocker: Blocker;
}

function BlockerAlert({ title, description, blocker }: BlockerAlertProps) {
  if (blocker.state !== "blocked") {
    return null;
  }

  return (
    <AlertDialog open={blocker.state === "blocked"}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => blocker.reset()}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              blocker.proceed();
            }}
            variant="destructive"
          >
            Lanjut
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ButtonWithAlert, BlockerAlert };
