'use client';

import { inflateLikes } from "@/lib/mappers";
import { LocalPokemon, Member } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import { useState } from "react";

export function useOrCreateMember() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getOrCreateMember(groupId: string, name: string, pool: LocalPokemon[]): Promise<Member> {
        setLoading(true);
        const supabase = createClient();

        // Attempt to fetch a member with the same name in the same group to prevent duplicates
        const { data: existingMembers, error: fetchError } = await supabase
            .from("members")
            .select()
            .eq("group_id", groupId)
            .eq("name", name);

        if (fetchError) {
            setError(fetchError.message);
            setLoading(false);
            throw new Error(fetchError.message);
        }

        if (existingMembers && existingMembers.length > 0) {
            console.log(`Found existing member with name "${name}" in group ${groupId}, returning existing member.`);
            setLoading(false);
            // Inflate existing member and return it
            return {
                memberId: existingMembers[0].id,
                name: existingMembers[0].name,
                groupId: existingMembers[0].group_id,
                likes: inflateLikes(existingMembers[0].likes, pool),
                superLike: null, // TODO: Handle super likes
            };
        }
        console.log(`No existing member with name "${name}" found in group ${groupId}, creating new member.`);

        // If no existing member is found, create a new one
        const { data: newMember, error: createError } = await supabase
            .from("members")
            .insert([
                {
                    id: nanoid(),
                    group_id: groupId,
                    name: name,
                    likes: [],
                }
            ])
            .select();

        if (createError) {
            setError(createError.message);
            setLoading(false);
            throw new Error(createError.message);
        }

        setLoading(false);
        return {
            memberId: newMember[0].id,
            name: newMember[0].name,
            groupId: newMember[0].group_id,
            likes: [],
            superLike: null,
        };
    }

    return { getOrCreateMember, loading, error };
}