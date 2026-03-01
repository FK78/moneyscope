import { UpdatePasswordForm } from "@/components/UpdatePasswordForm";
import { AuthLayout } from "@/components/AuthLayout";

export default function UpdatePasswordPage() {
  return (
    <AuthLayout backHref="/auth/login" backLabel="Back to login">
      <UpdatePasswordForm />
    </AuthLayout>
  );
}
