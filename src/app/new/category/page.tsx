import { Metadata } from "next";
import NewCategoryContent from "./components/categoryContent";

export const metadata: Metadata = {
  title: "O Pedal Café - Nova Categoria",
  description: "Página de Cadastrar Nova Categoria do Pedal Café",
};

const NewCategoryPage = () => {
  return (
    <main>
      <NewCategoryContent />
    </main>
  );
};

export default NewCategoryPage;
