"use client";
import Header from "@/components/common/header";
import { LuClipboardCheck } from "react-icons/lu";
import { parseCookies } from "nookies";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { setupAPIClient } from "../../../services/api";

const NewCategoryPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies(undefined);

    if (!cookies["@nextauth.token"]) {
      router.push("/");
    }
  }, []);

  async function handleAddCategory(event: FormEvent) {
    event.preventDefault();

    if (name === "") {
      return toast.error("Favor preencher o campo de nome!", {
        style: {
          fontSize: "12px",
        },
      });
    }

    setIsLoading(true);

    setTimeout(async () => {
      setIsLoading(false);

      const apiClient = setupAPIClient();
      await apiClient.post("/category", {
        name: name,
      });

      toast.success("Categoria cadastrada com sucesso!", {
        style: {
          fontSize: "12px",
        },
      });
      setName("");
    }, 1000);
  }

  return (
    <main>
      <div className="absolute right-0 z-50">
        <Header />
      </div>
      <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-newCategory bg-cover bg-center" />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-2">
            <h1 className="flex justify-center text-2xl font-bold">
              Adicionar Categoria
            </h1>
            <p className="px-8 text-center text-sm text-muted-foreground">
              Cadastre novas categorias para personalizar seu cardápio.
            </p>
          </div>

          <form
            onSubmit={handleAddCategory}
            className="mx-auto mb-2 mt-5 w-full max-w-md"
          >
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="category">
                  Categoria
                </Label>
                <Input
                  id="category"
                  placeholder="Digite o nome da categoria..."
                  type="text"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <Button disabled={isLoading} type="submit">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                <span className="flex items-center gap-2">
                  Adicionar Categoria <LuClipboardCheck size={20} />
                </span>
              </Button>
            </div>
          </form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Quer cadastrar um novo produto?{" "}
            <Link
              href="/new/product"
              className="underline transition-all hover:text-primary"
            >
              Clique Aqui
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default NewCategoryPage;
