import styles from "./EditPost.module.css";

import { useEffect, useState } from "react";
import { useNavigate , useParams} from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocument } from "../../hooks/useFetchDocument";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";

const EditPost = () => {

 

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState("");

  const { user } = useAuthValue();
  const navigate = useNavigate();

  const {id} = useParams()
  const {document:post} = useFetchDocument("posts",id)
  const {updateDocument , response} = useUpdateDocument("posts")


  useEffect(() =>{

    if(post){
      setTitle(post.title)
      setBody(post.body)
      setImage(post.image)
    
      const textTags = post.tagsArray.join(", ")

      setTags(textTags)
    }

  },[post])

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    //validando a url da imagems
    try {
      new URL(image);
    } catch (error) {
      setFormError("A imagem precisa ser uma URL.");
    }

    //criando array de tags
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    //checando todos os valores
    if (!title || !image || !tags || !body) {
      setFormError("Por favor , preencha todos os campos!");
    }
    if (formError) return;

    const data ={
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    };

    updateDocument(id,data)
    //redirect aqui para a home page
    navigate("/dashboard");
  };

  return (
    <div className={styles.edit_post}>
      {post && (
        <>
      <h2>Editando post : {post.title}</h2>
      <p>Altere os dados do post como desejar</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Titulo:</span>
          <input
            type="text"
            name="tittle"
            required
            placeholder="Pense em um bom titulo..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>

        <label>
          <span>URL da imagem:</span>
          <input
            type="text"
            name="image"
            required
            placeholder="Insira uma imagem que represente o seu post"
            onChange={(e) => setImage(e.target.value)}
            value={image}
          />
        </label>

        <p className={styles.preview_title}>Preview da imagem atual:</p>
        <img className={styles.image_preview} src={post.image} alt={post.title}/>

        <label>
          <span>Conteudo:</span>
          <textarea
            name="body"
            required
            placeholder="Insira o conteudo do post"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          ></textarea>
        </label>

        <label>
          <span>Tags:</span>
          <input
            type="text"
            name="tags"
            required
            placeholder="Insira as tags separadas por virgula"
            onChange={(e) => setTags(e.target.value)}
            value={tags}
          />
        </label>

        {!response.loading && <button className="btn">Editar!</button>}
        {response.loading && (
          <button className="btn" disabled>
            Aguarde.. .
          </button>
        )}
        {(response.error || formError) && (
          <p className="error">{response.error || formError}</p>
        )}
      </form>
        </>
      )}
    </div>
  );
};

export default EditPost;
