import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import ProductCard from "./components/ProductCard";
import { colors, formInputsList, productList } from "./data";
import Modal from "./components/ui/Modal";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { IProduct } from "./interfaces";
import { validateProduct } from "./validation";
import ErrorMessage from "./components/ErrorMessage";
import CircleColor from "./components/ui/CircleColor";
import { v4 as uuid } from "uuid";

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
  const [products, setProducts] = useState<IProduct[]>(productList);
  const [tempColors, setTempColors] = useState<string[]>([]);
  console.log(tempColors);
  const closeModal = () => {
    setIsOpen(false);
    setProduct(initialProduct);
    setTempColors([]);
  };
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
    setProducts((prev) => [
      { ...product, id: uuid(), colors: tempColors },
      ...prev,
    ]);

    closeModal();
  };
  /*------------render------------------*/

  return (
    <div className="container mx-auto">
      <Button
        className="bg-indigo-700 hover:bg-indigo-800 cursor-pointer "
        width="w-fit"
        onClick={openModal}
      >
        ADD Product
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 border-2 border-red-500">
        {products.map((product) => (
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
          <div className="flex items-center flex-wrap space-x-1">
            {tempColors.map((color) => (
              <span
                key={color}
                style={{ backgroundColor: color }}
                className="p-2 m-1 rounded-lg text-sm font-semibold"
              >
                {color}
              </span>
            ))}
          </div>
          <div className="flex items-center flex-wrap space-x-1">
            {colors.map((color) => (
              <CircleColor
                key={color}
                color={color}
                onClick={() => {
                  tempColors.includes(color)
                    ? setTempColors((prev) => prev.filter((e) => e !== color))
                    : setTempColors((prev) => [...prev, color]);
                }}
              />
            ))}
          </div>

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
