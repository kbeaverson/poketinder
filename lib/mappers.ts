import { group } from "console";
import { Database } from "..";
import { Group, LocalPokemon, Member } from "./types";

type GroupRow = Database["public"]["Tables"]["groups"]["Row"] & {
    members: Database["public"]["Tables"]["members"]["Row"][]
}

type StoredLike = {
    pokemonId: string;
    liked: boolean;
}

export function mapGroupRow(row: GroupRow, pool: LocalPokemon[]): Group {
    return {
        groupId: row.id,
        name: row.name ?? "",
        createdAt: new Date(row.created_at),
        pokemonPool: [],
        members: row.members.map((memberRow) => mapMemberRow(memberRow, pool)),
    };
}

export function mapMemberRow(row: Database["public"]["Tables"]["members"]["Row"], pool: LocalPokemon[]): Member {
    return {
        memberId: row.id,
        name: row.name,
        groupId: row.group_id,
        likes: inflateLikes(row.likes, pool),
        superLike: null,
    };
}

function inflateLikes(raw: unknown, pool: LocalPokemon[]): [boolean, LocalPokemon][] {
    if (!raw || !Array.isArray(raw)) { return []; }

    return (raw as StoredLike[]).flatMap(({pokemonId, liked}) => {
        const pokemon = pool.find(p => p.pokemonId === pokemonId);
        if (!pokemon) { return []; }
        return [[liked, pokemon]];
    });
}

export function deflateLikes(likes: [boolean, LocalPokemon][]): StoredLike[] {
    return likes.map(([liked, pokemon]) => ({
        pokemonId: pokemon.pokemonId,
        liked,
    }));
}