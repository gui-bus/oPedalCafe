import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RegisterImage from '../../assets/Register.png'

import { UserRegisterForm } from "./components/user-register-form";

export const metadata: Metadata = {
  title: "O Pedal Café - Criar Conta",
  description: "Página de Criar Conta do Pedal Café",
};

export default function RegisterPage() {
  return (
    <>
      <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <Image
                src="/logo.png"
                alt="Logo O Pedal Café"
                sizes="100vw"
                height={0}
                width={0}
                className="mx-auto h-auto w-72 object-cover"
                priority
              />
            </div>
            <UserRegisterForm />
          </div>
        </div>
        <div className="relative hidden h-full flex-col bg-muted text-white dark:border-r lg:flex">
        <Image
            src={RegisterImage}
            alt="Register cover"
            sizes="100vw"
            height={0}
            width={0}
            className="w-full h-screen object-cover"
            priority
          />
        </div>
      </div>
    </>
  );
}
