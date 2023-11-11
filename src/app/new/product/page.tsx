import { Metadata } from "next";
import NewProductContent from "./components/productContent";

export const metadata: Metadata = {
  title: "O Pedal Café - Novo Produto",
  description: "Página de Cadastrar Novo Produto do Pedal Café",
};

const NewProductPage = () => {
  return (
    <main>
      <NewProductContent />
    </main>
  );
};

export default NewProductPage;
