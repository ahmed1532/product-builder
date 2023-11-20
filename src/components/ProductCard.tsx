import Image from "./Image";
import Button from "./ui/Button";
import { IProduct } from "../interfaces";
import { slicer } from "../utils/functions";
import CircleColor from "./ui/CircleColor";

interface IProps {
  product: IProduct;
  setProductToEdit: (product: IProduct) => void;
  openEditModal: () => void;
  idx: number;
  setProductToEditIdx: (val: number) => void;
  openConfirmModal: () => void;
}

const ProductCard = ({
  product,
  setProductToEdit,
  openEditModal,
  idx,
  setProductToEditIdx,
  openConfirmModal,
}: IProps) => {
  const { category, colors, description, imageURL, price, title } = product;
  const editProduct = () => {
    setProductToEdit(product);
    openEditModal();
    setProductToEditIdx(idx);
  };
  const deleteProduct = () => {
    setProductToEdit(product);
    openConfirmModal();
  };

  return (
    <div className="p-3 border max-w-sm md:max-w-lg mx-auto md:mx-0 overflow-hidden">
      <Image
        imageUrl={imageURL}
        alt={product.title}
        className="w-full mb-2 rounded-md h-48"
      />
      <h3 className="font-bold text-lg">{slicer(title, 20)}</h3>
      <p>{slicer(description)}</p>
      <div className="flex items-center my-4 space-x-2">
        {colors.length > 0 ? (
          colors.map((color) => <CircleColor key={color} color={color} />)
        ) : (
          <span>No colors available</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-semibold">${price}</span>
        <div className="flex items-center space-x-2">
          <p className="font-semibold">{category.name}</p>
          <Image
            imageUrl={category.imageURL}
            alt={category.name}
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2 mt-5">
        <Button
          className="bg-indigo-700 "
          onClick={() => {
            editProduct();
          }}
        >
          EDIT
        </Button>
        <Button
          className="bg-red-700 "
          onClick={() => {
            deleteProduct();
          }}
        >
          DELETE ❌
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
