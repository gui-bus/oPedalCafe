"use client";
import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  LuLogOut,
  LuListTodo,
  LuListOrdered,
  LuPlusCircle,
  LuMenu,
} from "react-icons/lu";

import { destroyCookie } from "nookies";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

interface NavItemProps {
  href: string;
  label: string;
  icon: any;
}

export function signOut() {
  destroyCookie(undefined, "@nextauth.token");

  toast.success("Logout realizado com sucesso!", {
    style: {
      fontSize: "12px",
    },
  });
}

const NavItem = ({ href, label, icon }: NavItemProps) => {
  return (
    <SheetClose className="my-2 w-full">
      <Link href={href}>
        <Button className="w-full">
          {label}{" "}
          {icon && React.cloneElement(icon, { size: 18, className: "ml-2" })}
        </Button>
      </Link>
    </SheetClose>
  );
};

const Header = () => {
  return (
    <header>
      <Sheet>
        <SheetTrigger>
          <div className="group flex items-center justify-center rounded-bl-3xl bg-primary p-4">
            <LuMenu
              size={32}
              className="text-white transition-all duration-300  group-hover:scale-110"
            />
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <Link href="/dashboard">
                <Image
                  src="/logo.png"
                  alt="Logo O Pedal Café"
                  sizes="100vw"
                  height={0}
                  width={0}
                  className="mx-auto h-auto w-72 object-cover"
                  priority
                />
              </Link>
            </SheetTitle>
            <Separator />
            <SheetDescription className="mx-auto w-full max-w-xs">
              <nav className="w-full">
                <SheetClose className="my-2 w-full">
                  <Link href="/">
                    <Button className="w-full" onClick={signOut}>
                      Logout <LuLogOut size={18} className="ml-2" />
                    </Button>
                  </Link>
                </SheetClose>

                <div className="flex w-full items-center justify-center">
                  <Separator className="flex w-1/3 justify-center" />
                  <p className="flex w-1/3 justify-center">Produtos</p>
                  <Separator className="flex w-1/3 justify-center" />
                </div>

                <NavItem
                  href="/products"
                  label="Cardápio"
                  icon={<LuListOrdered />}
                />

                <div className="flex w-full items-center justify-center gap-2">
                  <Separator className="flex w-1/3 justify-center" />
                  <p className="flex w-1/3 justify-center">Pedidos</p>
                  <Separator className="flex w-1/3 justify-center" />
                </div>

                <NavItem
                  href="/dashboard"
                  label="Lista de pedidos"
                  icon={<LuListTodo />}
                />

                <div className="flex w-full items-center justify-center gap-2">
                  <Separator className="flex w-1/3 justify-center" />
                  <p className="flex w-1/3 justify-center">Cadastro</p>
                  <Separator className="flex w-1/3 justify-center" />
                </div>

                <NavItem
                  href="/new/category"
                  label="Cadastrar Categoria"
                  icon={<LuPlusCircle />}
                />
                <NavItem
                  href="/new/product"
                  label="Cadastrar Produto"
                  icon={<LuPlusCircle />}
                />
              </nav>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
