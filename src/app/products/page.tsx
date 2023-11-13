import { Metadata } from "next";
import MenuContent from "./components/MenuContent";

export const metadata: Metadata = {
  title: "O Pedal Café - Cardápio",
  description: "Página de Cardápio do Pedal Café",
};

const NewCategoryPage = () => {
  return (
    <main>
      <MenuContent />
    </main>
  );
};

export default NewCategoryPage;
