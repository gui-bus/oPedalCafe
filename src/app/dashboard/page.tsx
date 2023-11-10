
import { Metadata } from "next";
import DashboardContent from "./components/DashboardContent";

export const metadata: Metadata = {
  title: "O Pedal Café - Dashboard",
  description: "Página de Dashboard do Pedal Café",
};

export default function DashboardPage() {


  return <DashboardContent />;
}
