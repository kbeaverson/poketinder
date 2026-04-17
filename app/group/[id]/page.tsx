import { PokemonClient } from "pokenode-ts"

type Props = {
    params: { id: string }
}

export default async function GroupPage({ params }: Props) {
    const { id } = await params

    const pokeapi = new PokemonClient()
    const pokemon = await pokeapi.getPokemonSpeciesByName("garchomp")
        .then((data) => console.log(data.id, data.varieties))
    
    return (
        <div>
            <h1>Group ID: { id }</h1>
            {/* Fetch and display group details using the ID */}
        </div>
    )
}