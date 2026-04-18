'use client';

import { LocalPokemon, Member } from "@/lib/types";
import { useState } from "react";
import SwipeScreen from "./SwipeScreen";

type GroupPageClientProps = {
    groupId: string,
    pokemonPool: LocalPokemon[],
};

export default function GroupPageClient({ groupId, pokemonPool}: GroupPageClientProps) {
    const [member, setMember] = useState<Member>({
        memberId: "123",
        name: "Ash Ketchum",
        groupId: groupId,
        likes: [],
        superLike: null
    })

    function handleSwipe(pokemon: LocalPokemon, isLike: boolean) {
        setMember(prev => ({
            ...prev,
            likes: [...prev.likes, [isLike, pokemon]]
        }))
        console.log((isLike ? 'Liked!' : 'Passed!') + member.likes.length);
    }

    function handleUndo() {
        setMember(prev => ({
            ...prev,
            likes: prev.likes.slice(0, -1)
        }))
        console.log('Undo!' + member.likes.length);
    }

    return (
        <div>
            <SwipeScreen
                pool={pokemonPool}
                memberId={member.memberId}
                likes={member.likes}
                onSwipe={handleSwipe}
                onUndo={handleUndo}
            />
        </div>
    )
}