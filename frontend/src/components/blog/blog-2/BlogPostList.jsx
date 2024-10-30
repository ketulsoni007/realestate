import { useSelector } from "react-redux";
import SingleBlogCard from "./SingleBlogCard";

const BlogPostList = () => {
  const { currentDataItems } = useSelector((state)=>state.data);
  return (
    <div>
      <div className="mt-2">
        {currentDataItems?.map((feed) => (
          <SingleBlogCard key={feed.id} {...feed} />
        ))}
      </div>
    </div>
  );
};

export default BlogPostList;
