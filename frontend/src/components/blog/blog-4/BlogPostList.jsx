import { useSelector } from "react-redux";
import SingleFeedCardGrid from "../../common/page-componets/SingleFeedCardGrid";

const BlogPostList = () => {
  const { currentDataItems } = useSelector((state)=>state.data);
  return (
    <div className="flex flex-wrap gap-4 mt-8">
      {currentDataItems.map((feed) => (
        <SingleFeedCardGrid key={feed.id} {...feed} />
      ))}
    </div>
  );
};

export default BlogPostList;
