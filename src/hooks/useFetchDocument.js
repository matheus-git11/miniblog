import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  doc, // ter a instancia de um documento e seus metodos
  getDoc, // permite pegar o documento
} from "firebase/firestore";

// colecao dos dados , search = parametro de busca  e id do usuario
export const useFetchDocument = (docCollection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  //resolvendo problema com memory leak
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      if (cancelled) return; // se estiver cancelado , acaba a funcao
      setLoading(true);

      try {
        const docRef = await doc(db, docCollection, id); // pegando a referencia do documento
        const docSnap = await getDoc(docRef);
        setDocument(docSnap.data());
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.mesage);
        setLoading(false);
      }
    }
    loadDocument(); // invocando a funcao
  }, [docCollection,id ,cancelled]);

  // tambem para lidar com o problema de memory leak junto com o cancelled
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {document, loading , error };
};
