import React from "react"

import { useFetchDocuments } from "../../hooks/useFetchDocuments"
import { useQuery } from "../../hooks/useQuery"


const Search = () => {

    const query = useQuery() // chamando a funcao usequery para nos retornar o resultado da busca pela url
    const search = query.get("q") //colocamos na url /search?q= , logo damos o get no Q

  return (
    <div>
        <h2>Search</h2>
        <p>{search}</p>
    </div>
  )
}

export default Search