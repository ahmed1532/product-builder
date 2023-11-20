import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { categories, colors, formInputsList, productList } from "./data";
import Modal from "./components/ui/Modal";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import { IProduct } from "./interfaces";
import { validateProduct } from "./validation";
import ErrorMessage from "./components/ErrorMessage";
import CircleColor from "./components/ui/CircleColor";
import { v4 as uuid } from "uuid";
import Select from "./components/ui/Select";
import toast, { Toaster } from "react-hot-toast";

function App() {
  /*------------------toast---------------- */
  const notify = () =>
    toast("Product Deleted", {
      icon: "👏",
      style: {
        backgroundColor: "black",
        color: "white",
      },
    });
  const notify2 = () =>
    toast("Product Edited", {
      icon: "👏",
      style: {
        backgroundColor: "black",
        color: "white",
      },
    });
  const notify3 = () =>
    toast("Product created", {
      icon: "👏",
      style: {
        backgroundColor: "black",
        color: "white",
      },
    });

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
    colors: "",
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [errorsObject, setErrorsObject] = useState(initialErrorsObject);
  const [product, setProduct] = useState<IProduct>(initialProduct);
  const [productToEdit, setProductToEdit] = useState<IProduct>(initialProduct);
  const [productToEditIdx, setProductToEditIdx] = useState<number>(0);
  const [products, setProducts] = useState<IProduct[]>(productList);
  const [tempColors, setTempColors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const closeModal = () => {
    setIsOpen(false);
    setProduct(initialProduct);
    setTempColors([]);
  };
  const closeEditModal = () => {
    setIsOpenEditModal(false);
    setTempColors([]);
  };
  const closeConfirmModal = () => {
    setIsOpenConfirmModal(false);
  };
  const openModal = () => setIsOpen(true);
  const openEditModal = () => {
    setIsOpenEditModal(true);
  };
  const openConfirmModal = () => {
    setIsOpenConfirmModal(true);
  };
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    setErrorsObject({
      ...errorsObject,
      [name]: "",
    });
  };
  const onChangeEditHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductToEdit({ ...productToEdit, [name]: value });
    setErrorsObject({
      ...errorsObject,
      [name]: "",
    });
  };

  function cancelHandler(): void {
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
      colors: tempColors,
    });

    const hasNoErrorMsg =
      Object.values(errors).some((value) => value == "") &&
      Object.values(errors).every((value) => value == "");
    console.log(hasNoErrorMsg);
    if (!hasNoErrorMsg) {
      setErrorsObject(errors);
      return;
    }
    const arr=[
      {
        ...product,
        id: uuid(),
        colors: tempColors,
        category: selectedCategory,
      },
      ...products,
    ]
    setProducts( arr);


    localStorage.setItem("products", JSON.stringify(arr));
    
 
    closeModal();
    setProduct(initialProduct);
    setTempColors([]);
    notify3();
  };
  const submitEditHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const { title, description, imageURL, price } = productToEdit;

    const errors = validateProduct({
      title,
      description,
      imageURL,
      price,
      colors: tempColors.concat(productToEdit.colors),
    });

    const hasNoErrorMsg =
      Object.values(errors).some((value) => value == "") &&
      Object.values(errors).every((value) => value == "");
    console.log(hasNoErrorMsg);
    if (!hasNoErrorMsg) {
      setErrorsObject(errors);
      return;
    }
    const updated = [...products];
    updated[productToEditIdx] = {
      ...productToEdit,
      colors: tempColors.concat(productToEdit.colors),
    };
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    closeEditModal();
    setProductToEdit(initialProduct);
    setTempColors([]);
    notify2();
  };
  const removeHandler = () => {
    
    const updated = [...products].filter((e) => e.id !== productToEdit.id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
    closeConfirmModal();
    notify();
  };
  /*----------------local storage---------------*/
  useEffect(() => {
    const items = localStorage.getItem("products");
    if (items) {
      setProducts(JSON.parse(items));
    } else {
      setProducts(productList);
    }
  }, []);

  /*------------render------------------*/

  return (
    <div className="container mx-auto">
      <Button
        className="bg-indigo-700 hover:bg-indigo-900 cursor-pointer mb-9 mt-3 mx-auto font-bold text-2xl flex items-center p-3  "
        width="w-fit"
        onClick={openModal}
      >
        ADD PROUDUCT
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 border-2 border-red-500">
        {products.map((product, idx) => (
          <ProductCard
            product={product}
            key={product.id}
            setProductToEdit={setProductToEdit}
            openEditModal={openEditModal}
            openConfirmModal={openConfirmModal}
            idx={idx}
            setProductToEditIdx={setProductToEditIdx}
          />
        ))}
      </div>
      {/*-------------------Add  Modal--------------*/}
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
          <Select
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
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
                  setErrorsObject({ ...errorsObject, colors: "" });
                }}
              />
            ))}
            <ErrorMessage msg={errorsObject.colors} />
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
      {/*-------------------Edit  Modal--------------*/}
      <Modal
        isOpen={isOpenEditModal}
        closeModal={closeEditModal}
        title="Edit This PRODUCT"
      >
        <form className="space-y-3" onSubmit={submitEditHandler}>
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
                value={productToEdit[input.name]}
                onChange={onChangeEditHandler}
              />
              <ErrorMessage msg={errorsObject[input.name]} />
            </div>
          ))}
          <Select
            selected={productToEdit.category}
            setSelected={(value) =>
              setProductToEdit({ ...productToEdit, category: value })
            }
          />
          <div className="flex items-center flex-wrap space-x-1">
            {tempColors.concat(productToEdit.colors).map((color) => (
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
                  if (productToEdit.colors.includes(color)) {
                    const filtered = [...productToEdit.colors].filter(
                      (e) => e !== color
                    );
                    setProductToEdit({ ...productToEdit, colors: filtered });
                  }
                  if (tempColors.includes(color)) {
                    setTempColors((prev) => prev.filter((e) => e !== color));
                  } else if (
                    !productToEdit.colors.includes(color) &&
                    !tempColors.includes(color)
                  ) {
                    setTempColors((prev) => [...prev, color]);
                  }

                  setErrorsObject({ ...errorsObject, colors: "" });
                }}
              />
            ))}
            <ErrorMessage msg={errorsObject.colors} />
          </div>

          <div className="flex items-center space-x-3 mt-5 ">
            <Button className="bg-indigo-700 hover:bg-indigo-800 cursor-pointer ">
              Submit
            </Button>
          </div>
        </form>
      </Modal>
      {/*-------------------Confirm remove Modal--------------*/}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure tou want to remove this product from your store?"
      >
        <div className="flex items-center space-x-3 mt-5 ">
          <Button
            className="bg-[#c2344d] hover:bg-red-800 cursor-pointer "
            onClick={removeHandler}
          >
            Yes, remove
          </Button>
          <Button className="bg-gray-600 hover:bg-gray-800 cursor-pointer ">
            Cancel
          </Button>
        </div>
      </Modal>

      <Toaster />
    </div>
  );
}

export default App;
