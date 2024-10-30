import { useSelector } from "react-redux";
import SingleFeedCard from "./SingleFeedCard";

const BlogPostsList = () => {
  const { currentDataItems } = useSelector((state)=>state.data);
  return (
    <div className="flex flex-wrap gap-4">
      {currentDataItems.slice(0, 6).map((feed) => (
        <SingleFeedCard key={feed.id} {...feed} />
      ))}
    </div>
  );
};

export default BlogPostsList;
