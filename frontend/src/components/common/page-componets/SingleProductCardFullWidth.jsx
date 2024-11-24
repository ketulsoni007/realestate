import { BiBed, BiMap, BiMapAlt, BiTab } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import CardHoverIcons from "./CardHoverIcons";
import CardLabels from "./CardLabels";
import config from "config/config";
import useWindowWidth from "hooks/windowWidth";

const SingleProductCardFullWidth = ({
  _id,
  title,
  address,
  price,
  status,
  purpose,
  bedrooms,
  bathrooms,
  square_footage,
  images,
  showLabels,
  type,
}) => {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const imageLinks = images && images.length > 0 ? `${config.IMAGE_URL}/property/${images[0].image}` : '';
  return (
    <div className="relative grid grid-cols-1 gap-3 mt-3 overflow-hidden border rounded-lg shadow-light sm:grid-cols-3 md:grid-cols-4 dark:border-card-dark group">
      <div className="sm:col-span-1">
        <div className="group !opacity-100 overflow-hidden relative h-full">
          <Link to={`/property/${_id}`} className="!opacity-100">
            <img
              src={imageLinks}
              alt={title}
              className="object-cover h-full w-full group-hover:scale-125 transition-a"
              style={{width :'100%',height:'300px',objectFit:'cover'}}
            />
          </Link>
          <CardHoverIcons />
        </div>
        {!showLabels && <CardLabels purpose={status} distance={type} />}
      </div>
      <div className="sm:col-span-2 md:col-span-3">
        <div className="p-3">
          <Link to="/" className="group-hover:text-primary transition-a">
            <h1 className="text-lg font-bold capitalize">{title}</h1>
          </Link>

          <div className="mt-2 flex-align-center gap-x-2">
            <BiMap />
            <p>{address?.street}</p>
          </div>
          {/* <p className="mt-2">{`${description.slice(
            0,
            textLength || 180
          )}...`}</p> */}
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
    </div>
  );
};

export default SingleProductCardFullWidth;
