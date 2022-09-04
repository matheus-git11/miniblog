//css
import styles from "./Post.module.css";

//hooks
import { useParams } from "react-router-dom";

const Post = () => {

    const {id} = useParams();

  return (
    <div>
      <h1>Post {id}</h1>
    </div>
  );
};

export default Post;
