import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocument";

const Dashboard = () => {
  const { user } = useAuthValue();
  const uid = user.uid;
  const {deleteDocument} = useDeleteDocument("posts")

  //posts do usuario
  const {
    documents: posts,
    loading,
    error,
  } = useFetchDocuments("posts", null, uid);
  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerencie os seus posts</p>
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <Link to="/posts/create" className="btn">
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <div className={styles.post_header}>
          <span>Título</span>
          <span>Ações</span>
        </div>
      )}

      {posts &&
        posts.map((post) => (
          <div className={styles.post_row} key={post.id}>
            <p>{post.title}</p>
            <div className={styles.actions}>
              <Link to={`/posts/${post.id}`} className={styles.button}>
                Ver
              </Link>
              <Link to={`/posts/edit/${post.id}`}  className={styles.button}>
                Editar
              </Link>
              <button 
              onClick={() => deleteDocument(post.id)}
               className={styles.button} >Excluir</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Dashboard;
