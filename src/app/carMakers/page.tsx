import * as React from "react";
import { CarMakerBulk } from "./(types)/CarMakerBulk";
import CarMakerCard from "./(components)/car-maker-card";
import CarMakersHeader from "./(components)/car-makers-header";
import { getToken } from "@lib/helper";
import Header from "@components/home/header";

async function fetchCarMakers(): Promise<CarMakerBulk[]> {
  const token = getToken();
  const response = await fetch(
    "https://mywarsha-gdgzdxdecghmfwa8.israelcentral-01.azurewebsites.net/api/carmakers",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      method: "GET",
      cache: "no-cache",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch car makers");
  }
  return response.json();
}

export default async function Page() {
  const carMakers = await fetchCarMakers();
  return (
    <div className="p-3">
      <CarMakersHeader />
      <div className="grid grid-cols-[repeat(auto-fit,150px)] gap-4 justify-center mt-4">
        {carMakers.map((carMaker) => (
          <CarMakerCard
            key={carMaker.id}
            id={carMaker.id}
            name={carMaker.name}
            logo={carMaker.logo}
          />
        ))}
      </div>
    </div>
  );
}
