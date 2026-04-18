import { PokemonClient } from "pokenode-ts"
import { LocalPokemon, LocalPokemonType } from "./types"

export async function fetchPokemonByName(name: string): Promise<LocalPokemon[]> {
    const pokeapi = new PokemonClient()
    const results: LocalPokemon[] = []
    try {
        const pokemonData = await pokeapi.getPokemonSpeciesByName(name)
        const defaultVariety = pokemonData.varieties.find(v => v.is_default)

        // TODO: Handle GMAX eventually

        const megaEvolutions = pokemonData.varieties.filter(v => v.pokemon.name.includes("-mega"))
        const megaDetails: LocalPokemon[] = []
        for (const mega of megaEvolutions) {
            const formDetails = await pokeapi.getPokemonByName(mega.pokemon.name)
            megaDetails.push({
                pokemonId: formDetails.id.toString(),
                name: formDetails.name,
                type: formDetails.types.map(t => t.type.name as any) as [LocalPokemonType] | [LocalPokemonType, LocalPokemonType],
                imageUrl: formDetails.sprites.front_default || "",
            })
        }

        const otherForms = pokemonData.varieties.filter(v => !v.pokemon.name.includes("-mega") && !v.pokemon.name.includes("-gmax") && !v.is_default)
        const formDetails: LocalPokemon[] = []
        for (const form of otherForms) {
            const formInfo = await pokeapi.getPokemonByName(form.pokemon.name)
            formDetails.push({
                pokemonId: formInfo.id.toString(),
                name: formInfo.name,
                type: formInfo.types.map(t => t.type.name as any) as [LocalPokemonType] | [LocalPokemonType, LocalPokemonType],
                imageUrl: formInfo.sprites.front_default || "",
            })
        }

        const pokemonDetails = await pokeapi.getPokemonByName(defaultVariety?.pokemon.name || name)
        results.push({
            pokemonId: pokemonDetails.id.toString(),
            name: pokemonDetails.name,
            type: pokemonDetails.types.map(t => t.type.name as any) as [LocalPokemonType] | [LocalPokemonType, LocalPokemonType],
            imageUrl: pokemonDetails.sprites.front_default || "",
            megas: megaEvolutions.length > 0 ? megaDetails : undefined
        })
        if (formDetails.length > 0) {
            results.push(...formDetails)
        }
    } catch (error) {
        console.log(`Error fetching data for ${name}:`, error)
    }
    return results
}
