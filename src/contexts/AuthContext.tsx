"use client";
import { createContext, ReactNode, useState } from "react";

import { api } from "../services/apiClient";

import { destroyCookie, setCookie, parseCookies } from "nookies";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

type AuthContextData = {
  user: UserProps | undefined;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
};

type SignInProps = {
  email: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  const router = useRouter();
  try {
    destroyCookie(undefined, "@nextauth.token");
    router.push("/");
    toast.success("Logout realizado com sucesso!", {
      style: {
        fontSize: "12px",
      },
    });
  } catch (error) {
    toast.error("Erro ao realizar logout!", {
      style: {
        fontSize: "12px",
      },
    });
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;
  const router = useRouter();

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/session", {
        email,
        password,
      });

      const { id, name, token } = response.data;

      console.log(response.data);

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({
        id,
        name,
        email,
      });

      const aaa = (api.defaults.headers["Authorization"] = `Bearer ${token}`);

      router.push("/dashboard");

      toast.success("Login realizado com sucesso!", {
        style: {
          fontSize: "12px",
        },
      });
    } catch (err) {
      toast.error("Email e/ou senha incorretos!", {
        style: {
          fontSize: "12px",
        },
      });
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
