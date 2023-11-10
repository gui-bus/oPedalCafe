"use client";
import Header from "@/components/common/header";
import { useEffect } from "react";
import { LuListTodo } from "react-icons/lu";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";

const DashboardContent = () => {
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies(undefined);

    if (!cookies["@nextauth.token"]) {
      router.push("/");
    }
  }, []);
  return (
    <>
      <div className="absolute right-0 z-50">
        <Header />
      </div>
      <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="bg-dashboard absolute inset-0 bg-cover bg-center" />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-2">
            <h1 className="flex items-center justify-center gap-2 text-2xl font-bold">
              Lista de pedidos <LuListTodo size={24} />
            </h1>
            <p className="px-8 text-center text-sm text-muted-foreground">
              Confira a lista de pedidos que devem ser produzidos
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
