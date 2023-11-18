import Image from "./Image";
import Button from "./ui/Button";
import { IProduct } from "../interfaces";
import { slicer } from "../utils/functions";

interface IProps {
  product: IProduct;
}

const ProductCard = ({ product }: IProps) => {
  const { category, colors, description, imageURL, price, title } = product;
  return (
    <div className="p-3 border max-w-sm md:max-w-lg mx-auto md:mx-0">
      <Image
        imageUrl={imageURL}
        alt={product.title}
        className="w-full mb-2 rounded-md h-48"
      />
      <h3>{title}</h3>
      <p>{slicer(description)}</p>
      <div className="flex items-center my-4 space-x-2">
        {colors.map((color) => (
          <span
            key={color}
            className={` w-5 h-5 bg-${color} rounded-full cursor-pointer `}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span>${price}</span>

        <Image
          imageUrl={category.imageURL}
          alt={category.name}
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="flex items-center justify-between space-x-2 mt-5">
        <Button className="bg-indigo-700 " onClick={() => {}}>
          EDIT
        </Button>
        <Button className="bg-red-700 ">DELETE ❌</Button>
      </div>
    </div>
  );
};

export default ProductCard;
