import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/AuthLayout";
import { MailCheck } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <AuthLayout backHref="/auth/login" backLabel="Back to login">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <MailCheck className="h-6 w-6 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>Account created successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            We&apos;ve sent a confirmation link to your email address. Click it to verify your account and start tracking your finances.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
