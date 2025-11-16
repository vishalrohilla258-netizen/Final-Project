import React, { useState, useEffect } from "react";
import Gradient from "../partial/Gradient";

const Pricing = () => {
  const [pricingPlans, setPricingPlans] = useState([]);

  useEffect(() => {
    // Fetch pricing data from the JSON file
    fetch("/pricing.json")
      .then((response) => response.json())
      .then((data) => setPricingPlans(data))
      .catch((error) => console.error("Error fetching pricing data:", error));
  }, []);

  return (
    <>
      <main className="flex flex-grow items-center justify-center relative isolate px-6 lg:px-8">
        <Gradient />
        <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              The right price for you, whoever you are
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
            We believe in delivering value with integrity. Our goal is to
            provide solutions that are reliable, efficient, and tailored to your
            needs.
          </p>

          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
            {pricingPlans.map((plan) => (
              <div
                key={plan.planName}
                className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:p-10 lg:mx-0"
              >
                <h3 className="text-base font-semibold leading-7 text-indigo-600">
                  {plan.planName}
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-base text-gray-500">
                    /{plan.billingCycle}
                  </span>
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  {plan.description}
                </p>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600 sm:mt-10">
                  {plan.features.map((feature, index) => (
                    <li className="flex gap-x-3" key={index}>
                      <svg
                        className="h-6 w-5 flex-none text-indigo-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.buttonUrl}
                  className="mt-8 block rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
                >
                  {plan.buttonText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Pricing;
