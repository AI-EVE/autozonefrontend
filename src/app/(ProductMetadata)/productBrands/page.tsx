"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "./(components)/page-header";

import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus, Pencil, SendHorizontal, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import SubmitProductMakerForm from "./(components)/submit-product-maker-form";

interface ProductMaker {
  id: string;
  name: string;
}
interface ProductMakerMapped {
  id: string;
  name: string;
  isEditing: boolean;
  newName: string;
}

export default function Page() {
  const { toast } = useToast();
  const [productMakers, setProductMakers] = useState<ProductMakerMapped[]>([]);

  const [loading, setLoading] = useState(false);
  const [toggleAddProductMakerForm, setToggleAddProductMakerForm] =
    useState(false);

  // Load product makers
  useEffect(() => {
    setLoading(true);

    fetch(
      `https://mywarsha-gdgzdxdecghmfwa8.israelcentral-01.azurewebsites.net/api/productBrands`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auto-zone-token")}`,
        },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          const productMakersToMap = data.map((productMaker: ProductMaker) => ({
            ...productMaker,
            isEditing: false,
            newName: "",
          }));
          setProductMakers(productMakersToMap);
          return;
        }

        toast({
          title: "Error",
          description: "An error occurred while loading product makers",
          variant: "destructive",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "An error occurred while loading product makers",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Add a new product maker
  const handleAddProductMaker = (productMakerName: string) => {
    if (loading) return;

    if (!productMakerName || productMakerName.trim() === "") {
      toast({
        title: "Empty Fields",
        description: "Make Sure To Enter A Both Fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    fetch(
      `https://mywarsha-gdgzdxdecghmfwa8.israelcentral-01.azurewebsites.net/api/productBrands`,
      {
        method: "POST",
        body: JSON.stringify({ name: productMakerName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auto-zone-token")}`,
        },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          toast({
            title: "Success",
            description: "Product Maker added successfully",
          });

          const newProdcutType = await response.json();

          setProductMakers((prev) => [
            ...prev,
            {
              ...newProdcutType,
              isEditing: false,
              newName: "",
            },
          ]);

          setToggleAddProductMakerForm(false);
          return;
        }

        const error = await response.json();
        toast({
          title: "Empty Name",
          description: error.message || "Make Sure To Enter a Name",
          variant: "destructive",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "An error occurred while adding the product brand",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Edit a product maker
  const handleEditProductMaker = (productMaker: ProductMakerMapped) => {
    if (loading) return;

    if (!productMaker.newName) {
      toast({
        title: "Empty Name",
        description: "Enter a name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    fetch(
      `https://mywarsha-gdgzdxdecghmfwa8.israelcentral-01.azurewebsites.net/api/productBrands/${productMaker.id}`,
      {
        method: "PUT",
        body: JSON.stringify({ name: productMaker.newName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auto-zone-token")}`,
        },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          toast({
            title: "Success",
            description: "Product Brand edited successfully",
          });

          const newProductMaker = await response.json();

          setProductMakers((prev) =>
            prev.map((prevProductMaker) => {
              if (prevProductMaker.id !== productMaker.id) {
                return prevProductMaker;
              } else {
                return {
                  ...prevProductMaker,
                  name: newProductMaker.name,
                  isEditing: true,
                  newName: "",
                };
              }
            })
          );
          return;
        }

        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "An error occurred while editing",
          variant: "destructive",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "An error occurred while editing the product brand",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Delete a product maker
  const handleDeleteProductMaker = (productMaker: ProductMakerMapped) => {
    if (loading) return;

    setLoading(true);

    fetch(
      `https://mywarsha-gdgzdxdecghmfwa8.israelcentral-01.azurewebsites.net/api/productBrands/${productMaker.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auto-zone-token")}`,
        },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          toast({
            title: "Success",
            description: "Product Brand deleted successfully",
          });

          setProductMakers((prev) =>
            prev.filter(
              (prevProductMaker) => prevProductMaker.id !== productMaker.id
            )
          );
          return;
        }

        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "An error occurred while deleting",
          variant: "destructive",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "An error occurred while deleting the product brand",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPageHeaderButtonClick = () => {
    setToggleAddProductMakerForm(!toggleAddProductMakerForm);
  };

  const closeAddProductMakerForm = () => {
    if (loading) return;
    setToggleAddProductMakerForm(false);
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-dark-2 bg-opacity-90 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      )}

      {toggleAddProductMakerForm ? (
        <SubmitProductMakerForm
          handleAddProductMaker={handleAddProductMaker}
          closeForm={closeAddProductMakerForm}
        />
      ) : null}

      <div className="p-3 h-[100vh] flex flex-col">
        <PageHeader onButtonClick={onPageHeaderButtonClick} />

        <div className="flex-1 overflow-auto">
          <div className="flex flex-col sm:container mx-auto sm:px-4 gap-8">
            {productMakers.length > 0 ? (
              productMakers.map((productMaker) => (
                <React.Fragment key={productMaker.id}>
                  <div className="max-w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-amber-500 font-semibold text-lg cursor-default">
                          {productMaker.name}
                        </h3>
                      </div>
                      <Switch
                        onCheckedChange={(value) => {
                          if (loading) return;
                          setProductMakers((prev) =>
                            prev.map((prevProductMaker) => {
                              if (prevProductMaker.id !== productMaker.id) {
                                return {
                                  ...prevProductMaker,
                                  isEditing: false,
                                  newName: "",
                                };
                              } else {
                                if (value) {
                                  return {
                                    ...prevProductMaker,
                                    isEditing: true,
                                  };
                                } else {
                                  return {
                                    ...prevProductMaker,
                                    isEditing: false,
                                  };
                                }
                              }
                            })
                          );
                        }}
                        checked={productMaker.isEditing}
                        className="data-[state=checked]:bg-amber-500"
                      />
                    </div>
                    {productMaker.isEditing ? (
                      <>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEditProductMaker(productMaker);
                          }}
                          className="flex flex-col  gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Input
                              onChange={(e) => {
                                setProductMakers((prev) =>
                                  prev.map((prevProductMaker) => {
                                    if (
                                      prevProductMaker.id !== productMaker.id
                                    ) {
                                      return prevProductMaker;
                                    } else {
                                      return {
                                        ...prevProductMaker,
                                        newName: e.target.value,
                                      };
                                    }
                                  })
                                );
                              }}
                              value={productMaker.newName}
                              type="text"
                              placeholder="New Name?"
                              className="mt-2 bg-dark-2 text-white md:max-w-[70%] mr-auto focus:border-amber-500 focus:ring-amber-500 rounded-md px-3 py-2 outline-none"
                            />
                            <Button
                              type="submit"
                              className="mt-2 bg-amber-500 hover:bg-amber-600 rounded-md px-3 py-2"
                            >
                              <Pencil />
                            </Button>
                            <Button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteProductMaker(productMaker);
                              }}
                              className="mt-2 bg-red-500  hover:bg-red-600 rounded-md px-3 py-2"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </form>
                      </>
                    ) : null}
                  </div>

                  <div className="w-[25%] h-[1px] mx-auto bg-amber-400 mb-8"></div>
                </React.Fragment>
              ))
            ) : (
              <div className="flex items-center justify-center h-[50vh]">
                <p className="text-amber-500 font-semibold text-lg">
                  No Product Brand Found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
