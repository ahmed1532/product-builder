import { useState } from "react";
import ProductCard from "./components/ProductCard";
import { productList } from "./data";
import Modal from "./components/ui/Modal";
import Button from "./components/ui/Button";

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeModal = () => setIsOpen(false);

  const openModal = () => setIsOpen(true);
  return (
    <div className="container mx-auto">
      <Button
        className="bg-indigo-700 hover:bg-indigo-800 cursor-pointer "
        width="w-fit"
        onClick={openModal}
      >
        ADD
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 border-2 border-red-500">
        {productList.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
      <Modal isOpen={isOpen} closeModal={closeModal} title="ADD A NEW PRODUCT">
        <div className="flex items-center space-x-3">
          <Button className="bg-indigo-700 hover:bg-indigo-800 cursor-pointer">
            Submit
          </Button>
          <Button className="bg-gray-400 hover:bg-gray-500  cursor-pointer">
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
