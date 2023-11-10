"use client";

import * as React from "react";

import { useState, FormEvent, useContext } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuUserPlus2 } from "react-icons/lu";
import toast from "react-hot-toast";

import { AuthContext } from "../../../contexts/AuthContext";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({ className, ...props }: UserAuthFormProps) {
  const { Register } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    if (name === "" || email === "" || password === "") {
      return toast.error("Favor preencher todos os campos!", {
        style: {
          fontSize: "12px",
        },
      });
    }

    setIsLoading(true);

    setTimeout(async () => {
      setIsLoading(false);

      let data = {
        name,
        email,
        password,
      };

      await Register(data);
    }, 1000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleRegister}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="nome">
              Nome
            </Label>
            <Input
              id="nameRegister"
              placeholder="Digite seu nome..."
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="emailRegister"
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
              id="passwordRegister"
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
              Criar Conta <LuUserPlus2 size={20} />
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
