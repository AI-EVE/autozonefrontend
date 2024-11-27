import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, SendHorizontal } from "lucide-react";
import { useState } from "react";

interface SubmitProductMakerFormProps {
  handleAddProductMaker: (productMakerName: string) => void;
  closeForm: () => void;
}

export default function SubmitProductMakerForm({
  handleAddProductMaker,
  closeForm,
}: SubmitProductMakerFormProps) {
  const [productMakerName, setProductMakerName] = useState("");

  return (
    <div
      onClick={(e) => {
        closeForm();
      }}
      className="fixed top-0 left-0 w-full h-full bg-dark-2 bg-opacity-90  flex justify-center"
    >
      <form
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleAddProductMaker(productMakerName);
        }}
        className="flex flex-col gap-2 fixed"
      >
        <div className="flex items-center gap-2">
          <Input
            onChange={(e) => {
              e.preventDefault();
              setProductMakerName(e.target.value);
            }}
            value={productMakerName}
            type="text"
            placeholder="Product Maker Name"
            className="mt-2 bg-dark-2 text-white focus:border-amber-500 focus:ring-amber-500 rounded-md px-3 py-2 outline-none"
          />

          <Button
            type="submit"
            className="mt-2 bg-amber-500 text-black hover:bg-amber-600 rounded-md px-3 py-2"
          >
            <SendHorizontal />
          </Button>
        </div>
      </form>
    </div>
  );
}
