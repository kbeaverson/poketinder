'use client';

import { LocalPokemon, Member } from "@/lib/types";
import { useMemo, useState } from "react";
import Image from "next/image";

type ResultsScreenProps = {
    members: Member[]
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
    const [hoveredPokemonId, setHoveredPokemonId] = useState<string | null>(null);
    // Load group results using groupId, e.g. fetch from API or use context
    
    if (sections.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                No results yet. Start swiping to see your matches here!
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4 space-y-8">
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
                            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))"
                        }}
                    >
                        {results.map(
                            ({ pokemon, likedBy }) => (
                                <div
                                    key={pokemon.pokemonId}
                                    className="relative w-full aspect-square"
                                    onMouseEnter={() => setHoveredPokemonId(pokemon.pokemonId)}
                                    onMouseLeave={() => setHoveredPokemonId(null)}
                                >
                                    <Image
                                        src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemon.pokemonId + ".png"}
                                        alt={pokemon.name}
                                        fill
                                        sizes="80px"
                                        className="object-contain"
                                    />

                                    {/* Hover overlay */}
                                    {hoveredPokemonId === pokemon.pokemonId && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border boder-gray-200 rounded-lg shadow-lg px-2 py-1 z-10 whitespace-nowrap">
                                            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}: {likedBy.map(m => m.name).join(', ')}
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </section>
            ))}
        </div>
    )
}