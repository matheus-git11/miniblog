import React from "react";

//pages
import PostDetail from "../../components/PostDetail";

//css
import styles from './Search.module.css'

//hooks
import { Link } from "react-router-dom";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";

const Search = () => {
  const query = useQuery(); // chamando a funcao usequery para nos retornar o resultado da busca pela url
  const search = query.get("q"); //colocamos na url /search?q= , logo damos o get no Q
  const { documents: posts } = useFetchDocuments("posts" , search);

  return (
    <div className={styles.search_container}>
      <h2>Voce Buscou por: {search}</h2>
      <div>
        {posts && posts.length === 0 && (
          <>
            <p>Nao foram encontrados posts a partir da sua busca...</p>
            <Link to="/" className="btn btn-dark">
              Voltar
            </Link>
          </>
        )}
        {posts && posts.map((post) => <PostDetail key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default Search;
