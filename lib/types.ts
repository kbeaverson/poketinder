export type Group = {
    groupId: string
    name: string
    createdAt: Date
    members: Member[]
    pokemonPool: Pokemon[]
}

export type Member = {
    memberId: string
    name: string
    groupId: string
    likes: Pokemon[]
    superLike: Pokemon | null
}

export type Pokemon = {
    pokemonId: string
    name: string
    type: [PokemonType] | [PokemonType, PokemonType]
    imageUrl: string
}

export enum PokemonType {
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