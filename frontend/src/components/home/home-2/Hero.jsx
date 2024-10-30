import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const Hero = () => {
  const [tabView, setTabView] = useState('Buy');
  const tabOptions = [
    { label: 'Buy', value: 'Buy' },
    { label: 'Rent', value: 'Rent' },
    { label: 'Sell', value: 'Sell' }
  ];
  return (
    <div
      className="relative flex-wrap min-h-screen gap-2 md:-mt-10 flex-center-center"
      style={{
        background: "url('/images/hero-bg-pattern.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      <div className="absolute top-0 right-0 rounded-full bg-[#04a7ff]/30 dark:bg-[#04a7ff]/50 w-72 h-72 -z-10 blur-[120px]"></div>
      <div className="flex-1 basis-[30rem]">
        <h1 className="text-4xl font-bold capitalize md:text-5xl">
          find your dream <br /> home right away
        </h1>
        <div className="pl-3 mt-5 border-l-4 border-primary">
          <p>
            Explore a wide range of properties tailored to your needs, from cozy apartments to luxury villas. Whether you’re looking to buy, rent, or sell, we bring you a curated selection of homes in prime locations.
          </p>
        </div>
        <div className="mt-6 flex-align-center gap-x-3">
          <button className="btn btn-primary">find property</button>
          <button className="px-2 py-2 rounded-md btn-secondary">
            <FiArrowRight />
          </button>
        </div>
        <div className="mt-6 overflow-hidden rounded-lg sm:cursor-pointer flex-align-center card-shadow dark:shadow-none w-fit dark:bg-card-dark">
          {tabOptions.map((tab) => (
            <div
              key={tab.value}
              className={`px-3 py-1 ${tabView === tab.value ? 'bg-primary' : ''}`}
              onClick={() => setTabView(tab.value)}
            >
              <span className={`${tabView === tab.value ? 'text-white' : ''}`}>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 basis-[20rem] h-full">
        <img
          src="/images/hero-5.jpeg"
          alt=""
          className="w-full h-fit  md:h-[80vh] rounded-xl object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;
