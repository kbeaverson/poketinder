export type Group = {
    groupId: string
    name: string
    createdAt: Date
    members: Member[]
    pokemonPool: LocalPokemon[]
}

export type Member = {
    memberId: string
    name: string
    groupId: string
    likes: [boolean, LocalPokemon][]
    superLike: LocalPokemon | null
}

export type LocalPokemon = {
    pokemonId: string
    name: string
    type: [LocalPokemonType] | [LocalPokemonType, LocalPokemonType]
    imageUrl: string
    megas?: LocalPokemon[] // For mega evolutions, if applicable
}

export enum LocalPokemonType {
    normal = "normal",
    fire = "fire",
    water = "water",
    electric = "electric",
    grass = "grass",
    ice = "ice",
    fighting = "fighting",
    poison = "poison",
    ground = "ground",
    flying = "flying",
    psychic = "psychic",
    bug = "bug",
    rock = "rock",
    ghost = "ghost",
    dragon = "dragon",
    dark = "dark",
    steel = "steel",
    fairy = "fairy"
}