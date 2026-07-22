"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">
          Helpdesk
        </CardTitle>

        <CardDescription>
          Welcome back! Sign in to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-6">

          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              placeholder="********"
            />
          </div>

          <Button
            className="w-full"
            type="submit"
          >
            Sign In
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}