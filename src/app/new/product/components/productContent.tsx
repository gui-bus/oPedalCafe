"use client";
import Header from "@/components/common/header";
import { LuClipboardCheck, LuImagePlus } from "react-icons/lu";
import { parseCookies } from "nookies";
import { useState, FormEvent, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import { setupAPIClient } from "../../../../services/api";
import Image from "next/image";

interface CategoryProps {
  id: string;
  name: string;
}

const NewProductContent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState<File | null>(null);

  const [categories, setCategories] = useState<CategoryProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/category");

        const categoryList = response.data as CategoryProps[];

        setCategories(categoryList);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchData();
  }, []);

  const [categorySelected, setCategorySelected] = useState("");

  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies(undefined);

    if (!cookies["@nextauth.token"]) {
      router.push("/");
    }
  }, []);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (
      image.type === "image/jpeg" ||
      image.type === "image/png" ||
      image.type === "image/webp"
    ) {
      setImageAvatar((prevImage) => {
        return image;
      });
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      toast.error("Envie uma imagem no formato JPEG, PNG ou WEBP!");
    }
  }

  function handleChangeCategory(event: any) {
    setCategorySelected(event.target.value);
  }

  async function handleAddProduct(event: FormEvent) {
    event.preventDefault();

    try {
      const data = new FormData();

      if (
        name === "" ||
        price === "" ||
        description === "" ||
        imageAvatar === null ||
        categorySelected === ""
      ) {
        return toast.error("Favor preencher todos os campos!", {
          style: {
            fontSize: "12px",
          },
        });
      }

      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categories[categorySelected as any].id);
      data.append("file", imageAvatar);

      const apiClient = setupAPIClient();
      await apiClient.post("/product", data);

      setIsLoading(true);

      setTimeout(async () => {
        setIsLoading(false);

        toast.success("Produto cadastrado com sucesso!", {
          style: {
            fontSize: "12px",
          },
        });
        setName("");
      }, 1000);
    } catch (err) {
      toast.error("Ocorreu um erro ao cadastrar este produto :(");
    }

    setName("");
    setPrice("");
    setDescription("");
    setImageAvatar(null);
    setAvatarUrl("");
  }

  return (
    <main>
      <div className="absolute right-0 z-50">
        <Header />
      </div>
      <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="bg-newProduct absolute inset-0 bg-cover bg-center" />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-2">
            <h1 className="flex justify-center text-2xl font-bold">
              Adicionar Produto
            </h1>
            <p className="px-8 text-center text-sm text-muted-foreground">
              Expanda as opções do seu menu com facilidade.
            </p>
          </div>

          <form
            onSubmit={handleAddProduct}
            className="mx-auto mb-2 mt-5 w-full max-w-md"
          >
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label
                  className="group mx-auto flex aspect-square h-full max-h-[10rem] w-full cursor-pointer items-center justify-center rounded-xl border border-input"
                  htmlFor="productImage"
                >
                  <span className={`${avatarUrl ? "absolute" : "flex"}`}>
                    <LuImagePlus
                      size={30}
                      className={`z-[99] cursor-pointer transition-all duration-300 group-hover:scale-105 ${
                        avatarUrl ? "text-white" : "text-muted-foreground"
                      }`}
                    />
                  </span>

                  {avatarUrl && (
                    <Image
                      src={avatarUrl}
                      alt="Preview do Produto"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="mx-auto h-full w-full rounded-xl object-cover"
                    />
                  )}
                </Label>
                <Input
                  id="productImage"
                  type="file"
                  className="hidden text-muted-foreground"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled={isLoading}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFile}
                />
              </div>
              <div className="grid gap-1">
                <select
                  value={categorySelected}
                  onChange={handleChangeCategory}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground shadow-sm  ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="default" className="hidden">
                    Selecione a categoria do produto...
                  </option>
                  {categories.map((category, index) => (
                    <option
                      className="text-black"
                      key={category.id}
                      value={index}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="productName">
                  Nome do produto
                </Label>
                <Input
                  id="productName"
                  placeholder="Digite o nome do produto..."
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
                <Label className="sr-only" htmlFor="productPrice">
                  Preço do produto
                </Label>
                <Input
                  id="productPrice"
                  placeholder="Digite o valor do produto..."
                  type="number"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Textarea
                  placeholder="Descrição do produto..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button disabled={isLoading} type="submit">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                <span className="flex items-center gap-2">
                  Adicionar Produto <LuClipboardCheck size={20} />
                </span>
              </Button>
            </div>
          </form>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Quer cadastrar uma nova categoria?{" "}
            <Link
              href="/new/category"
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

export default NewProductContent;
