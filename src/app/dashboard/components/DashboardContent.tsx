"use client";
import Header from "@/components/common/header";
import { useEffect, useState } from "react";
import {
  LuCheckCircle2,
  LuListTodo,
  LuListX,
  LuRefreshCcw,
} from "react-icons/lu";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setupAPIClient } from "@/services/api";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface OrdersProps {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
  created_at: string;
}

export interface OrderItemProps {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  };
  order: {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
  };
}

const DashboardContent = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<OrdersProps[]>([]);
  const [modalItem, setModalItem] = useState<OrderItemProps[]>([]);

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
        const response = await apiClient.get("/orders");

        const ordersList = response.data as OrdersProps[];
        setOrders(ordersList);
      } catch (error) {
        console.error("Erro ao buscar orders:", error);
      }
    };

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/orders");

      const ordersList = response.data as OrdersProps[];
      setOrders(ordersList);

      toast.success("Lista de pedidos atualizada!", {
        style: {
          fontSize: "12px",
        },
      });
    } catch (error) {
      console.error("Erro ao buscar orders:", error);
    }
  };

  async function handleModal(id: string) {
    const fetchDetails = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/order/detail", {
          params: {
            order_id: id,
          },
        });

        setModalItem(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
      }
    };

    fetchDetails();
  }

  function calculateTotal(items: OrderItemProps[]) {
    return items.reduce(
      (total: any, item: any) =>
        total + item.amount * Number(item.product.price),
      0,
    );
  }

  async function handleFinish(id: string) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/order/finish", {
        order_id: id,
      });

      const response = await apiClient.get("/orders");

      const ordersList = response.data as OrdersProps[];
      setOrders(ordersList);

      toast.success("Pedido finalizado com sucesso!", {
        style: {
          fontSize: "12px",
        },
      });
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
    }
  }

  return (
    <>
      <div className="absolute right-0 z-50">
        <Header />
      </div>
      <main className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-dashboard bg-cover bg-center" />
        </div>
        <div className="lg:p-8">
          <div className="mx-auto mb-5 flex w-full max-w-md flex-col justify-center space-y-2">
            <h1 className="flex items-center justify-center gap-2 text-2xl font-bold">
              Lista de pedidos <LuListTodo size={25} />
            </h1>
            <p className="px-8 text-center text-sm text-muted-foreground">
              Confira a lista de pedidos que devem ser produzidos
            </p>
            <Button
              onClick={fetchData}
              className="group transition-all duration-300"
            >
              Atualizar lista de pedidos{" "}
              <LuRefreshCcw
                className="ml-2 group-hover:animate-spin"
                style={{
                  animationIterationCount: 1,
                  animationDuration: "1s",
                }}
                size={20}
              />
            </Button>
          </div>

          <article className="flex w-full flex-col items-center justify-center">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-input rounded-lg p-4 w-full max-w-md">
                <span className="flex items-center justify-center font-medium">
                  Nenhum pedido em aberto{" "}
                  <LuListX size={25} className="ml-2"/>
                </span>
                <span className="text-center text-sm text-muted-foreground">No momento não há nenhum pedido a ser preparado!</span>
              </div>
            ) : (
              <ScrollArea className="h-fit max-h-56 w-full max-w-md rounded-lg border border-input p-4">
                {orders.map((order) => (
                  <Dialog key={order.id}>
                    <DialogTrigger
                      className="mx-auto my-1 w-full max-w-md rounded-lg border border-input p-2 text-sm font-medium transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
                      onClick={() => handleModal(order.id)}
                    >
                      Mesa{" "}
                      {Number(order.table) < 10
                        ? `0${order.table}`
                        : order.table}{" "}
                      - {order.name}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex flex-col items-center justify-center">
                          <p className="mb-1 text-xl font-bold">
                            Detalhes do Pedido
                          </p>

                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <p>
                              Mesa:{" "}
                              <span className="font-bold">
                                {Number(order.table) < 10
                                  ? `0${order.table}`
                                  : order.table}
                              </span>
                            </p>
                            <p>
                              Cliente:{" "}
                              <span className="font-bold">{order.name}</span>
                            </p>
                            <p>
                              Hora:{" "}
                              <span className="font-bold">
                                {format(new Date(order.created_at), "HH:mm:ss")}
                              </span>
                            </p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        <ScrollArea className="h-full max-h-96">
                          {modalItem.map((item, index) => (
                            <div
                              key={index}
                              className="mt-2 w-full max-w-xs md:max-w-[38rem]"
                            >
                              <div className="flex w-full items-center justify-between gap-2">
                                <div className="hidden aspect-square h-20 w-20 rounded-xl object-cover md:block">
                                  <Image
                                    src={`http://localhost:3333/files/${item.product.banner}`}
                                    alt={item.product.name}
                                    height={0}
                                    width={0}
                                    sizes="100vw"
                                    className="aspect-square h-20 w-20 rounded-xl object-cover"
                                  />
                                </div>
                                <div className="mb-2 flex w-full min-w-full flex-col items-start justify-start border-b border-black/20 pb-2 text-start">
                                  <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap font-bold text-black">
                                    {Number(item.amount) < 10
                                      ? `0${item.amount}`
                                      : item.amount}{" "}
                                    - {item.product.name}
                                  </p>
                                  <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                                    {item.product.description}
                                  </p>
                                  <p className="mt-1 text-xs">
                                    Valor unitário -{" "}
                                    {Number(item.product.price).toLocaleString(
                                      "pt-BR",
                                      {
                                        style: "currency",
                                        currency: "BRL",
                                      },
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                        <div className="mt-2 font-bold">
                          Valor total do pedido:{" "}
                          {calculateTotal(modalItem).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                      </DialogDescription>
                      <Button
                        className="mt-4 w-full"
                        onClick={() => handleFinish(order.id)}
                      >
                        Marcar como concluído{" "}
                        <LuCheckCircle2 size={20} className="ml-2" />
                      </Button>
                    </DialogContent>
                  </Dialog>
                ))}
              </ScrollArea>
            )}
          </article>
        </div>
      </main>
    </>
  );
};

export default DashboardContent;
