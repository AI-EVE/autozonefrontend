import ProductManagement from "@components/dashboard/products-management";

const Page = () => {
  return (
    <main>
      <h2 className="  font-semibold text-4xl">INSERT RELEVENT DATA.</h2>
      <section className=" sm:pl-4">
        <div className=" space-y-5 mt-12">
          {/* <CategroyForm /> */}
          {/* <ProductTypeForm /> */}
          {/* <ProductBrandForm /> */}
          {/* <CarMakerManagement /> */}
          {/* <CarModelManagement /> */}
          {/* <CarGenAndModelManagement /> */}
          {/* <CarInfoManagement /> */}
          <ProductManagement />
        </div>

        {/* <Suspense fallback={<Spinner size={30} className=" mt-10" />}>
          <CategoryList />
        </Suspense> */}

        {/* <CarGenerationList /> */}
        {/* <InsetAccorion /> */}
      </section>
    </main>
  );
};

export default Page;
