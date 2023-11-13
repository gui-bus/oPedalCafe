"use client";
import Header from "@/components/common/header";
import { LuClipboardCheck, LuTrash2 } from "react-icons/lu";
import { parseCookies } from "nookies";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { setupAPIClient } from "../../../services/api";
import Image from "next/image";

import { ScrollArea } from "@/components/ui/scroll-area";
import { eventNames } from "process";

interface CategoryProps {
  id: string;
  name: string;
}

interface ProductProps {
  id: string;
  name: string;
  price: string;
  description: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  banner: string;
}

const MenuContent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [categorySelected, setCategorySelected] = useState("");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies(undefined);

    if (!cookies["@nextauth.token"]) {
      router.push("/");
    }
  }, []);

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

  function handleChangeCategory(event: any) {
    setCategorySelected(event.target.value);
  }

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (categorySelected === "") {
      return toast.error("Favor selecinar uma categoria!", {
        style: {
          fontSize: "12px",
        },
      });
    }

    const category_id = categories[categorySelected as any].id;

    const apiClient = setupAPIClient();
    const response = await apiClient.get("/category/product", {
      params: {
        category_id: category_id,
      },
    });

    setProducts(response.data);
  }

  async function handleDelete(id: string) {
    const apiClient = setupAPIClient();
    const response = await apiClient.delete("/product/remove", {
      params: {
        product_id: id,
      },
    });

    if (categorySelected === "") {
      return toast.error("Favor selecinar uma categoria!", {
        style: {
          fontSize: "12px",
        },
      });
    }

    const category_id = categories[categorySelected as any].id;

    const responseProducts = await apiClient.get("/category/product", {
      params: {
        category_id: category_id,
      },
    });

    setProducts(responseProducts.data);

    toast.success("Produto removido com sucesso!", {
      style: {
        fontSize: "12px",
      },
    });
  }

  useEffect(() => {
    // Esta função será executada sempre que 'products' for alterado
    console.log(products);
  }, [products]);

  return (
    <main>
      <div className="absolute right-0 z-50">
        <Header />
      </div>
      <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="bg-menu absolute inset-0 bg-cover bg-center" />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-2">
            <h1 className="flex justify-center text-2xl font-bold">Cardápio</h1>
            <p className="px-8 text-center text-sm text-muted-foreground">
              Veja abaixo quais produtos ja estão cadastrados no seu cardápio.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="mx-auto mb-2 mt-5 w-full max-w-md"
          >
            <div className="grid gap-2">
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

              <Button disabled={isLoading} type="submit">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                <span className="flex items-center gap-2">
                  Ver produtos cadastrados <LuClipboardCheck size={20} />
                </span>
              </Button>
            </div>
          </form>

          {products.length > 0 && (
            <ScrollArea className="mt-2 h-[16.5rem] min-h-fit w-full rounded-md border p-4">
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                {products.map((product) => (
                  <div key={product.id}>
                    <div className="my-2 flex w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-input p-2 ">
                      <div className="group relative aspect-square h-20 w-20 rounded-xl object-cover">
                        <button
                          className="invisible absolute inset-0 flex items-center justify-center group-hover:visible"
                          onClick={() => handleDelete(product.id)}
                        >
                          <LuTrash2
                            size={40}
                            className={`z-50 cursor-pointer rounded-full bg-primary p-2 text-white transition-all group-hover:scale-105`}
                          />
                        </button>
                        <Image
                          src={`http://localhost:3333/files/${product.banner}`}
                          alt={product.name}
                          height={0}
                          width={0}
                          sizes="100vw"
                          className="aspect-square h-20 w-20 rounded-xl object-cover"
                        />
                      </div>
                      <div className="w-full overflow-hidden">
                        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold">
                          {product.name}
                        </p>
                        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                          {product.description}
                        </p>
                        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                          {Number(product.price).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </main>
  );
};

export default MenuContent;
