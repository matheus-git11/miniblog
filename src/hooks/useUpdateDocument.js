import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

//const do reducer
const initialState = {
  loading: null,
  error: null,
};

//funcao do reducer
// o state sera o retorno da nova response de acordo com a action escolhida
// action pode ser um objeto que pode contar type e outros parametros
const updateReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useUpdateDocument = (docCollection) => {
  // dispatch executa a funcao insert(altera o estado)
  //initialtask e o estado inicial da  response
  const [response, dispatch] = useReducer(updateReducer, initialState);

  //deal with memory leak =
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const updateDocument = async (id,data) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });

    try {
      // time stamp utilizado para capturar a data
        const docRef = await doc(db,docCollection,id)
        const updateDocument = await updateDoc(docRef,data)
      

      checkCancelBeforeDispatch({
        type: "UPDATED_DOC",
        payload: updateDocument,
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

  return { updateDocument, response };
};
