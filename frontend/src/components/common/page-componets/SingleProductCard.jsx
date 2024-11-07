import { BiBed, BiMap, BiMapAlt, BiTab } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import CardHoverIcons from "./CardHoverIcons";
import CardLabels from "./CardLabels";
import config from "config/config";

const SingleProductCard = ({
  _id,
  title,
  address,
  price,
  type,
  status,
  bedrooms,
  bathrooms,
  images,
  square_footage,
  basis,
}) => {
  const imageLink = images && images?.length > 0 ? `${config.IMAGE_URL}/property/${images[0].image}` : '';
  const navigate = useNavigate();
  return (
    <div
      className={`flex-1 ${
        basis ? basis : "basis-[18rem]"
      } shadow-light dark:border-card-dark border rounded-lg overflow-hidden relative group`}
    >
      <div className="group !opacity-100 overflow-hidden relative">
        <a href="javascript:void(0)" className="!opacity-100">
          <img
            src={imageLink}
            alt={title}
            className="w-full  h-fit md:h-[250px] object-cover group-hover:scale-125 transition-a"
          />
        </a>
        <CardHoverIcons />
        <div className="absolute bottom-0 left-0 w-full px-2 py-2 transition-transform bg-gradient-to-t from-black/80 sm:translate-y-10 group-hover:translate-y-0 to-transparent">
          <div className="text-white flex-align-center gap-x-2">
            <BiMap />
            <p>{address?.street}</p>
          </div>
        </div>
      </div>
      <CardLabels purpose={status} distance={type} />
      <div className="p-3">
        <a href="javascript:void(0)" className="group-hover:text-primary transition-a">
          <h1 className="text-lg font-bold capitalize" onClick={()=>navigate(`/property/${_id}`)}>{title}</h1>
        </a>
        <div className="flex justify-between mt-3">
          <div className="flex-align-center gap-x-2">
            <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
              <BiBed />
            </div>
            <p className="text-sm">{bedrooms} Beds</p>
          </div>
          <div className="flex-align-center gap-x-2">
            <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
              <BiTab />
            </div>
            <p className="text-sm">{bathrooms} Bathrooms</p>
          </div>
          <div className="flex-align-center gap-x-2">
            <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
              <BiMapAlt />
            </div>
            <p className="text-sm">{square_footage}</p>
          </div>
        </div>

        <div className="mt-4 flex-center-between">
          <h1 className="text-lg font-semibold text-primary">${price}</h1>
          <button className="btn btn-secondary" onClick={()=>navigate(`/property/${_id}`)}>details</button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductCard;
