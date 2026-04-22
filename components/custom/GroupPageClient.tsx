'use client';

import { LocalPokemon, Member } from "@/lib/types";
import { useMemo, useState } from "react";
import SwipeScreen from "./SwipeScreen";
import ResultsScreen from "./ResultsScreen";
import { useGroup } from "@/hooks/useGroup";
import LoginForm from "./LoginForm";
import { useUpdateMember } from "@/hooks/useUpdateMember";
import { Menubar, MenubarMenu, MenubarTrigger } from "../ui/menubar";
import { Button } from "../ui/button";
import { CopyIcon, ShareIcon } from "lucide-react";

type GroupPageClientProps = {
    groupId: string,
    pokemonPool: LocalPokemon[],
};

export default function GroupPageClient({ groupId, pokemonPool}: GroupPageClientProps) {
    const [member, setMember] = useState<Member | null>(null);
    const { group, loading, error } = useGroup(groupId, pokemonPool);
    const { updateMember, loading: updateLoading, error: updateError } = useUpdateMember();

    const displayMembers = useMemo(() => {
        if (!member || !group) return group?.members ?? [];
        const others = group.members.filter(m => m.memberId !== member.memberId);
        return [member, ...others];
    }, [group, member]);

    async function handleSwipe(pokemon: LocalPokemon, isLike: boolean) {
        if (!member) return;
        if (member.likes.some(like => (like[1].pokemonId === pokemon.pokemonId) && (like[0] === isLike))) return;
        
        const updatedMember = {
            ...member,
            likes: [...member.likes, [isLike, pokemon]] as [boolean, LocalPokemon][]
        };

        setMember(updatedMember);
        await updateMember(updatedMember);
    }

    async function handleUndo() {
        if (!member) return;
        if (member.likes.length === 0) return;
        const updatedMember = {
            ...member,
            likes: member.likes.slice(0, -1) as [boolean, LocalPokemon][]
        };
        setMember(updatedMember);
        await updateMember(updatedMember);
    }

    function handleLoginSuccess(updatedMember: Member) {
        setMember(updatedMember);
    }

    return (
        <div>
            {loading && <p>Loading group...</p>}
            {error && <p>Error loading group: {error}</p>}
            {!loading && !error && !group && <p>Group not found.</p>}
            {!loading && !error && group && (
                <div>
                    <div className="px-6 text-center">
                        <h1 className="text-4xl font-bold mb-2">{group.name}</h1>
                        <div className="flex flex-row justify-center">
                            <p className="text-sm text-neutral-600">Click to copy the group link to invite friends:</p>
                            <Button 
                                variant="ghost"
                                onClick={() => navigator.clipboard.writeText(window.location.href)}
                            >
                                <CopyIcon />
                            </Button>
                        </div>
                    </div>
                    {!member && (
                        <LoginForm groupId={groupId} pool={pokemonPool} handleLoginSuccess={handleLoginSuccess} />
                    )}
                    <ResultsScreen members={displayMembers} />
                    {member && (
                        <SwipeScreen
                            pool={pokemonPool}
                            memberId={member.memberId}
                            likes={member.likes}
                            onSwipe={handleSwipe}
                            onUndo={handleUndo}
                        />
                    )}
                </div>
            )}
        </div>
    )
}