'use client';

import { LocalPokemon } from "@/lib/types";
import { useCallback, useMemo, useState } from "react";
import PokemonCard from "./PokemonCard";
import { Button } from "../ui/button";

export type SwipeScreenProps = {
    pool: LocalPokemon[],
    memberId: string,
    likes: [boolean, LocalPokemon][],
    onSwipe: (pokemon: LocalPokemon, isLike: boolean) => void,
    onUndo: () => void
}

export default function SwipeScreen({ pool, memberId, likes, onSwipe, onUndo }: SwipeScreenProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const TILT_FACTOR = 20;
    const SWIPE_THRESHOLD = 150; // Minimum distance in pixels to consider a swipe action
    const WINDOW_SIZE = 5; // Number of cards to keep in the DOM for smooth swiping
    const swipeQueue = useMemo(
        () => pool.filter(p => !likes.some(l => l[1].pokemonId === p.pokemonId)),
        [pool, likes]
    );
    const visiblePokemon = useMemo(
        () => swipeQueue.slice(0, WINDOW_SIZE),
        [swipeQueue]
    )

    const currentPokemon = swipeQueue[0];

    function isInteractiveTarget(target: EventTarget | null): boolean {
        if (!(target instanceof Element)) return false;
        return !!target.closest("button, a, input, select, textarea, [data-no-swipe]");
    }

    // Function to handle the start of a drag event
    function handlePointerDown(e: React.PointerEvent) {
        if (isInteractiveTarget(e.target)) {
            return;
        }
        e.currentTarget.setPointerCapture(e.pointerId); // Capture all events until release, even if the pointer moves outside the element
        setIsDragging(true);
        setStartX(e.clientX);
    }

    // Function to handle the movement during a drag event
    function handlePointerMove(e: React.PointerEvent) {
        if (!isDragging) return;
        setDragOffset(e.clientX - startX);
    }

    // Function to handle the end of a drag event
    function handlePointerUp() {
        setIsDragging(false);
        if (dragOffset > SWIPE_THRESHOLD) {
            triggerLike();
        } else if (dragOffset < -SWIPE_THRESHOLD) {
            triggerPass();
        } else {
            setDragOffset(0); // Snap back to original position
        }
    }

    const triggerLike = useCallback(() => {
        setDragOffset(600); // fly off to the right
        setTimeout(() => {
            if (currentPokemon) {
                onSwipe(currentPokemon, true);
            }
            advanceCard();
        }, 400);
    }, [currentPokemon, onSwipe]);

    const triggerPass = useCallback(() => {
        setDragOffset(-600); // fly off to the left
        setTimeout(() => {
            if (currentPokemon) {
                onSwipe(currentPokemon, false);
            }
            advanceCard();
        }, 400)
    }, [currentPokemon, onSwipe]);

    const triggerUndo = useCallback(() => {
        if (likes.length === 0) return; // Can't undo if we're at the beginning
        onUndo();
    }, [likes.length, onUndo]);

    function advanceCard() {
        setDragOffset(0);
    }

    return (
        <div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl flex flex-col"
            style={{
                height: "85vh",
                transform: isCollapsed ? "translateY(calc(100% - 60px))" : "translateY(0)",
                transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
            }}
        >
            {/* Handle strip */}
            <div
                className="flex justify-center pt-3 pb-2 cursor-pointer"
                onClick={() => setIsCollapsed(c => !c)}
            >
                <div className="w-10 h-1 bg-gray-300 rounded-full"/>
            </div>
            {/* Swipeable card stack */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
                {currentPokemon ? (
                    <div className="relative w-56 h-80">
                        {visiblePokemon.map((pokemon, stackPos) => {
                            const isTop = pokemon.pokemonId === currentPokemon.pokemonId;
                            return (
                                <div
                                    key={pokemon.pokemonId}
                                    className="absolute inset-0"
                                    style={{
                                        zIndex: WINDOW_SIZE - stackPos,
                                        transform: isTop
                                            ? `translate(${dragOffset}px) rotate(${dragOffset / TILT_FACTOR}deg)`
                                            : `scale(${0.85 - stackPos * 0.02}) translateY(${-stackPos * 8}px)`,
                                        transition: isTop && isDragging ? "none" : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                        cursor: isTop ? "grab" : "default",
                                    }}
                                    onPointerDown={isTop ? handlePointerDown : undefined}
                                    onPointerMove={isTop ? handlePointerMove : undefined}
                                    onPointerUp={isTop ? handlePointerUp : undefined}
                                >
                                    <PokemonCard pokemon={pokemon}/>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No more Pokémon to review!</p>
                )}
            </div>
            {/* Action buttons */}
            <div className="flex justify-center gap-6 py-6 shrink-0">
                <Button onClick={triggerPass} className="w-14 h-14 rounded-full bg-red-100 hover:bg-red-200 text-red-500 text-2xl flex items-center justify-center shadow-md transition-colors"> ✕ </Button>
                <Button onClick={triggerUndo} disabled={likes.length === 0} className="w-10 h-10 self-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg flex items-center justify-center shadow-sm transition-colors disabled:opacity-30"> ↩ </Button>
                <Button onClick={triggerLike} className="w-14 h-14 rounded-full bg-green-100 hover:bg-green-200 text-green-500 text-2xl flex items-center justify-center shadow-md transition-colors"> ♥ </Button>
            </div>
        </div>
    );
}