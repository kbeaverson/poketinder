'use client';

import { LocalPokemon, LocalPokemonType, Member } from "@/lib/types";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { TYPE_COLORS } from "./TypeBadge";
import { HybridTooltip, HybridTooltipContent, HybridTooltipProvider, HybridTooltipTrigger } from "../ui/hybrid-tooltip";

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

function toggleType(type: LocalPokemonType, prev: Set<LocalPokemonType>): Set<LocalPokemonType> {
    const newSet = new Set(prev);
    newSet.has(type) ? newSet.delete(type) : newSet.add(type);
    return newSet;
}


export default function ResultsScreen({ members }: ResultsScreenProps) {
    const sections = useMemo(
        () => aggregateResults(members),
        [members]
    );
    const [activeTypes, setActiveTypes] = useState<Set<LocalPokemonType>>(new Set());
    const filteredSections = useMemo(() => {
        if (activeTypes.size === 0) return sections;

        return sections.map(section => ({
            ...section,
            results: section.results.filter(result => 
                result.pokemon.type.some(t => activeTypes.has(t))
            ),
        }))
        .filter(section => section.results.length > 0);
    }, [sections, activeTypes]);
    
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
            {/* Type filter buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1 items-center">
                {Object.values(LocalPokemonType).map(type => (
                    <Button
                        key={type}
                        variant={activeTypes.has(type) ? "default" : "outline"}
                        onClick={() => setActiveTypes(prev => toggleType(type, prev))}
                        style={
                            activeTypes.has(type) ? { backgroundColor: TYPE_COLORS[type], borderColor: TYPE_COLORS[type], color: 'white' } : { borderColor: TYPE_COLORS[type]}
                        }
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                ))}
                {activeTypes.size > 0 && (
                    <Button
                        variant="outline"
                        onClick={() => setActiveTypes(new Set())}
                    >
                        Clear
                    </Button>
                )}
            </div>
            {filteredSections.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    <p>No liked Pokémon match the selected type(s).</p>
                    <Button onClick={() => setActiveTypes(new Set())}>
                        Clear Filter
                    </Button>
                </div>
            )}
            
            {filteredSections.map(({ score, results }) => (
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
                                <HybridTooltipProvider key={pokemon.pokemonId}>
                                    <HybridTooltip>
                                        <HybridTooltipTrigger asChild>
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
                                        </HybridTooltipTrigger>
                                        <HybridTooltipContent className="w-auto">
                                            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}: {likedBy.map(m => m.name).join(', ')}
                                        </HybridTooltipContent>
                                    </HybridTooltip>
                                </HybridTooltipProvider>
                            )
                        )}
                    </div>
                </section>
            ))}
        </div>
    )
}