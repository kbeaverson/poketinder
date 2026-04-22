'use client';

import { LocalPokemon, Member } from "@/lib/types";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type ResultsScreenProps = {
    members: Member[];
};

type PokemonResult = {
    pokemon: LocalPokemon;
    likedBy: Member[];
    score: number;
}

type ScoreSection = {
    score: number;
    results: PokemonResult[];
}

function aggregateResults(members: Member[]): ScoreSection[] {
    const resultMap = new Map<string, PokemonResult>();

    // Aggregate likes from all members
    for (const member of members) {
        for (const [isLike, pokemon] of member.likes) {
            if (!isLike) continue;

            const existing = resultMap.get(pokemon.pokemonId);
            if (existing) {
                existing.likedBy.push(member);
                existing.score += 1;
            } else {
                resultMap.set(pokemon.pokemonId, {
                    pokemon,
                    likedBy: [member],
                    score: 1,
                });
            }
        }
    }

    // Group results by score
    const sectionMap = new Map<number, PokemonResult[]>();
    for (const result of resultMap.values()) {
        const section = sectionMap.get(result.score) || [];
        section.push(result);
        sectionMap.set(result.score, section);
    }

    // Sort sections by score descending
    return Array.from(sectionMap.entries())
        .sort(([a], [b]) => b - a)
        .map(([score, results]) => ({score, results}));
}

export default function ResultsScreen({ members }: ResultsScreenProps) {
    const sections = useMemo(
        () => aggregateResults(members),
        [members]
    );
    
    if (sections.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                No results for this group yet. Get swiping to see some results here!
            </div>
        )
    }

    return (
        <div className="w-full p-4 space-y-8">
            <h2 className="text-2xl font-bold text-center">This group's likes ↴</h2>
            {sections.map(({ score, results }) => (
                <section key={score}>
                    {/* Section header */}
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Liked by {score} {score === 1 ? 'member' : 'members'}
                    </h3>

                    {/* Pokemon grid */}
                    <div 
                        className="grid gap-3"
                        style={{
                            gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))"
                        }}
                    >
                        {results.map(
                            ({ pokemon, likedBy }) => (
                                <Tooltip key={pokemon.pokemonId}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="relative w-full aspect-square"
                                        >
                                            <Image
                                                src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemon.pokemonId + ".png"}
                                                alt={pokemon.name}
                                                fill
                                                sizes="80px"
                                                className="object-contain"
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}: {likedBy.map(m => m.name).join(', ')}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        )}
                    </div>
                </section>
            ))}
        </div>
    )
}