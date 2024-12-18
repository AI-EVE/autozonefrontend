import { getProductsImageAction } from "@lib/actions/productsActions";
import { Product, ProductImage, ProductWithCategory } from "@lib/types";
import { cn } from "@lib/utils";
import React, { useMemo } from "react";
import FullImagesGallery from "./product-images";
import { formatCurrency } from "@lib/helper";
import { ProdcutAction } from "./product-actions";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Button } from "@components/ui/button";

const ProductItem = async ({
  product,
  pageSize,
  currPage,
}: {
  pageSize: number;
  currPage: string;
  product: ProductWithCategory;
}) => {
  const { data, error } = await getProductsImageAction(product.id);

  if (error) return <p>{error}</p>;

  const viewedImages = data?.length
    ? data.map((image: ProductImage) => image.imageUrl)
    : [];
  return (
    <li className={`${!product.isAvailable && "opacity-50 "}`}>
      <Link
        href={`/products/${product.id}`}
        className="space-y-1 flex flex-col"
      >
        {error ? (
          <h2>{error}</h2>
        ) : (
          <>
            {viewedImages.length ? (
              <FullImagesGallery
                imageUrls={viewedImages}
                productId={product.id}
                className="h-[250px] 3xl:h-[330px] 4xl:h-[400px]  relative rounded-lg overflow-hidden"
              />
            ) : (
              <div className=" h-[250px] 3xl:h-[330px] 4xl:h-[400px]  flex items-center justify-center  bg-foreground/10 rounded-t-lg">
                <ImageOff className=" w-20 h-20" />
              </div>
            )}
          </>
        )}
        {/* {product.category} */}
        <div className="    flex-1  space-y-1  flex flex-col ">
          <h1 className=" line-clamp-1 text-xl font-semibold">
            {product.name}
          </h1>

          <div className="flex items-center gap-[6px]">
            <div className="text-md font-bold text-muted-foreground">
              {product.typeName}
            </div>

            <div className="bg-muted-foreground w-1 h-1 rounded-full"></div>

            <div className="text-md font-bold text-muted-foreground">
              {product.brandName}
            </div>
            <div className="bg-muted-foreground w-1 h-1 rounded-full"></div>
            <div className="text-md font-bold text-muted-foreground">
              {product.category}
            </div>
          </div>

          <h2 className=" text-sm text-muted-foreground break-words line-clamp-2">
            {product.description}
          </h2>

          <div className=" flex justify-between   text-xs">
            <div className="flex flex-col gap-2">
              <span className=" text-red-500 dark:text-red-500">
                {formatCurrency(product.listPrice)}
              </span>
              <span className=" text-green-500 dark:text-green-600">
                {formatCurrency(product.salePrice)}
              </span>
            </div>
            <div className=" flex gap-3">
              <span
                className={cn("text-muted-foreground", {
                  "text-green-500 dark:text-green-600":
                    product.stock && product.isAvailable,
                })}
              >
                {product.stock && product.isAvailable
                  ? "In stock"
                  : "Out of stock"}
              </span>
              <ProdcutAction
                currPage={currPage}
                pageSize={pageSize}
                productId={product.id}
              />
            </div>
          </div>
          <Link href={`/products/${product.id}?edit=open`}>
            <Button className="w-full" variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
        </div>
      </Link>
    </li>
  );
};

export default ProductItem;
