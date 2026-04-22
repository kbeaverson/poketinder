'use client';

import { inflateLikes, mapGroupRow } from "@/lib/mappers";
import { Group, LocalPokemon, Member } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function useGroup(groupId: string, pokemonPool: LocalPokemon[]) {
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

        // Fetch group data
        supabase
            .from("groups")
            .select(`id, name, created_at, poolName, members (*)`)
            .eq("id", groupId)
            .single()
            .then(({ data, error }) => {
                if (error) {
                    setError(error.message);
                } else if (data) {
                    setGroup(mapGroupRow(data, pokemonPool));
                }
                setLoading(false);
            });

        // Subscribe to changes in the group
        const channel = supabase
            .channel(`group-${groupId}-members`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "members",
                    filter: `groupId=eq.${groupId}`,
                },
                (payload) => {
                    setGroup(prev => {
                        if (!prev) return prev;

                        const updatedMember: Member = {
                            memberId: payload.new.id,
                            name: payload.new.name,
                            groupId: payload.new.groupId,
                            likes: inflateLikes(payload.new.likes, pokemonPool),
                            superLike: null,
                        };

                        const updatedMembers = prev.members.map(m =>
                            m.memberId === updatedMember.memberId ? updatedMember : m
                        );

                        return { ...prev, members: updatedMembers };
                    })
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [groupId, pokemonPool]);

    return { group, loading, error };
}