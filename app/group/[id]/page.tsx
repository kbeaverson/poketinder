import { PokemonClient } from "pokenode-ts"
import { getPokemonPool } from "@/lib/pools/champions"
import { LocalPokemon, LocalPokemonType, Member } from "@/lib/types"
import PokemonCard from "@/components/custom/PokemonCard"
import SwipeScreen from "@/components/custom/SwipeScreen"
import GroupPageClient from "@/components/custom/GroupPageClient"
import { fetchPokemonByName } from "@/lib/fetch-pokemon"

type Props = {
    params: { 
        id: string 
    }
    searchParams: {
        pool?: string
    }
}

export default async function GroupPage({ params, searchParams }: Props) {
    const { id } = await params
    const { pool } = await searchParams
    const poolName = pool || "CHAMPIONS_MA"
    const pokemonPool: LocalPokemon[] = await import(`@/public/lib/pools/${poolName.toLowerCase()}.json`).then(m => m.default)

    return (
        <div className="w-full py-6">
            <GroupPageClient groupId={id} pokemonPool={pokemonPool} />
        </div>
    )
}