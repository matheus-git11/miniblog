import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection, //definir colecao
  query, // pegar um dado
  orderBy, // ordenacao
  onSnapshot,
  where, // filtro
  QuerySnapshot,
} from "firebase/firestore";

// colecao dos dados , search = parametro de busca  e id do usuario
export const useFetchDocuments = (docCollection, search = null, uid = null) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  //resolvendo problema com memory leak
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (cancelled) return; // se estiver cancelado , acaba a funcao
      setLoading(true);
      const collectionRef = await collection(db, docCollection); // referencia da collection passando banco e a colecao

      try {
        let q;
        //busca
        //dashboard

        // se for passado uma condicao que filtra os posts , funcao de procura
        if (search) {
          q = await query(
            collectionRef,
            where("tagsArray", "array-contains", search), // firebase necessita de criar um indice para isso
            orderBy("createdAt", "desc")  // tagsArray matriz e createdAt decrescente
          );

          //funcao que puxa os posts de um individuo
        } else if (uid) {
          q = await query(
            collectionRef,
            where("uid", "==", uid), //firebase necessita de criar um indice para isso
            orderBy("createdAt", "desc") // uid crescente e createdAt decrescente
          );
          //funcao que puxa todos os posts
        } else {
          q = await query(collectionRef, orderBy("createdAt", "desc"));
        }

        // criando a busca de dados pela data de criacao mais recentes

        //mapear os dados caso algo seja alterado , atualizando baseado na variavel Q
        await onSnapshot(q, (QuerySnapshot) => {
          setDocuments(
            QuerySnapshot.docs.map((doc) => ({
              id: doc.id, /// id
              ...doc.data(), /// titulo ,imagem , body
            }))
          );
        });

        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.message);

        setLoading(false);
      }
    }
    loadData(); // invocando a funcao
  }, [docCollection, search, uid, cancelled]);

  // tambem para lidar com o problema de memory leak junto com o cancelled
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { documents, loading, error };
};
