"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useContext, useState, FormEvent } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuLogIn } from "react-icons/lu";

import { AuthContext } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { signIn } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === "" || password === "") {
      return toast.error("Favor preencher os campos de email e senha!", {
        style: {
          fontSize: "12px",
        },
      });
    }

    setIsLoading(true);

    setTimeout(async () => {
      setIsLoading(false);

      let data = {
        email,
        password,
      };

      await signIn(data);
    }, 1000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleLogin}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="emailLogin"
              placeholder="Digite seu email..."
              type="email"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="senha">
              Senha
            </Label>
            <Input
              id="passwordLogin"
              placeholder="Digite sua senha..."
              type="password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span className="flex items-center gap-2">
              Login <LuLogIn size={20} />
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
