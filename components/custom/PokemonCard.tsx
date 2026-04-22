'use client';

import { useState } from "react";
import Image from "next/image";
import { LocalPokemon, LocalPokemonType } from "@/lib/types";
import TypeBadge from "@/components/custom/TypeBadge";

function formatName(name: string) {
    return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function PokemonFace({ pokemon }: { pokemon: LocalPokemon }) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
            <div className="relative w-36 h-36 flex items-center justify-center">
                <Image
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    draggable={false}
                    fill
                    sizes="144px"
                    className="object-contain drop-shadow-md"
                />
            </div>
            <h2 className="text-lg font-bold text-gray-800 text-center leading-tight">
                {formatName(pokemon.name)}
            </h2>
            <div className="flex gap-2 flex-wrap justify-center">
                {pokemon.type.map((t) => (
                    <TypeBadge key={t} type={t} />
                ))}
            </div>
        </div>
    );
}

export default function PokemonCard({ pokemon }: { pokemon: LocalPokemon }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeMega, setActiveMega] = useState<LocalPokemon | null>(null);
    const hasMegas = pokemon.megas && pokemon.megas.length > 0;

    function handleMegaClick(mega: LocalPokemon) {
        setActiveMega(mega);
        setIsFlipped(true);
    }

    function handleBaseClick() {
        setIsFlipped(false);
        setTimeout(() => setActiveMega(null), 600);
    }

    return (
        <div
            className="relative w-56 h-80"
            style={{ perspective: "1000px" }}
        >
            <div
                className="relative w-full h-full"
                style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Front face */}
                <div
                    className={`absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 overflow-hidden${isFlipped ? " pointer-events-none" : ""}`}
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                    {hasMegas && (
                        <div 
                            className="absolute top-3 right-3 flex flex-row gap-1.5 z-10"
                            style={{
                                opacity: isFlipped ? 0 : 1,
                                visibility: isFlipped ? "hidden" : "visible",
                                transition: "opacity 0.45s, visibility 0.45s",
                            }}
                        >
                            {pokemon.megas!.map((mega) => (
                                <div 
                                    className="mega-aura"
                                    key={mega.pokemonId}>
                                    <button
                                        onClick={() => handleMegaClick(mega)}
                                        title={formatName(mega.name)}
                                        data-no-swipe
                                        className="w-8 h-8 rounded-full bg-white/95 hover:bg-white/95 active:bg-white/95 active:scale-95 flex items-center justify-center shadow-sm border border-transparent hover:border-purple-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/70 transition-transform cursor-pointer relative z-1"
                                    >
                                        <Image
                                            src="/lib/mega-icon-test.png"
                                            alt="Mega"
                                            width={20}
                                            height={20}
                                            className="object-cover pointer-events-none select-none"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <PokemonFace pokemon={pokemon} />
                </div>

                {/* Back face — mega evolution */}
                <div
                    className={`absolute inset-0 bg-white rounded-2xl shadow-xl border border-purple-200 p-4 overflow-hidden${!isFlipped ? " pointer-events-none" : ""}`}
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <button
                        onClick={handleBaseClick}
                        data-no-swipe
                        className="absolute top-3 left-3 z-10 text-xs bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 font-medium px-2.5 py-1 rounded-full shadow-sm border border-gray-200 transition-all cursor-pointer"
                    >
                        Base
                    </button>
                    {activeMega && <PokemonFace pokemon={activeMega} />}
                </div>
            </div>
        </div>
    );
}
