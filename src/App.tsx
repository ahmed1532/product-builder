import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import ProductCard from "./components/ProductCard";
import { formInputsList, productList } from "./data";
import Modal from "./components/ui/Modal";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { IProduct } from "./interfaces";
import { validateProduct } from "./validation";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  /*------------handler------------------*/
  const initialProduct = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: [],
    category: {
      name: "",
      imageURL: "",
    },
  };
  const initialErrorsObject = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorsObject, setErrorsObject] = useState(initialErrorsObject);
  const [product, setProduct] = useState<IProduct>(initialProduct);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    setErrorsObject({
      ...errorsObject,
      [name]: "",
    });
  };

  function cancelHandler(event: MouseEvent<HTMLButtonElement>): void {
    setProduct(initialProduct);

    closeModal();
  }
  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { title, description, imageURL, price } = product;
    const errors = validateProduct({
      title,
      description,
      imageURL,
      price,
    });
    console.log(errors);

    const hasNoErrorMsg =
      Object.values(errors).some((value) => value == "") &&
      Object.values(errors).every((value) => value == "");
    console.log(hasNoErrorMsg);
    if (!hasNoErrorMsg) {
      setErrorsObject(errors);
      return;
    }
  };
  /*------------render------------------*/

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
        <form className="space-y-3" onSubmit={submitHandler}>
          {formInputsList.map((input) => (
            <div className="flex flex-col" key={input.id}>
              <label
                className="mb-1 text-sm font-medium text-gray-700"
                htmlFor={input.id}
              >
                {input.label}
              </label>
              <Input
                id={input.id}
                name={input.name}
                type="text"
                value={product[input.name]}
                onChange={onChangeHandler}
              />
              <ErrorMessage msg={errorsObject[input.name]} />
            </div>
          ))}
          <div className="flex items-center space-x-3 mt-5 ">
            <Button className="bg-indigo-700 hover:bg-indigo-800 cursor-pointer ">
              Submit
            </Button>
            <Button
              className="bg-gray-400 hover:bg-gray-500  cursor-pointer "
              onClick={cancelHandler}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default App;
