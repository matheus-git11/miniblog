import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

//const do reducer
const initialState = {
  loading: null,
  error: null,
};

//funcao do reducer
// o state sera o retorno da nova response de acordo com a action escolhida
// action pode ser um objeto que pode contar type e outros parametros
const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useInsertDocument = (docCollection) => {
  // dispatch executa a funcao insert(altera o estado)
  //initialtask e o estado inicial da  response
  const [response, dispatch] = useReducer(insertReducer, initialState);

  //deal with memory leak =
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const insertDocument = async (document) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });

    try {
      // time stamp utilizado para capturar a data
      const newDocument = { ...document, createdAt: Timestamp.now() };
      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      );

      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument,
      });
      
    } catch (error) {
      checkCancelBeforeDispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { insertDocument, response };
};
