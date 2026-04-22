'use client';

import { deflateLikes } from "@/lib/mappers";
import { Member } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export function useUpdateMember() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function updateMember(member: Member): Promise<Member> {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
            .from("members")
            .update({
                id: member.memberId,
                group_id: member.groupId,
                name: member.name,
                likes: deflateLikes(member.likes),
            })
            .eq("id", member.memberId)
            .select();

        setLoading(false);
        if (error) {
            setError(error.message);
            return member;
        }
        return {
            memberId: data[0].id,
            name: data[0].name,
            groupId: data[0].group_id,
            likes: member.likes, // We can return the original likes since we assume the update was successful
            superLike: member.superLike, // TODO: Handle super likes
        };
    }

    return { updateMember, loading, error };
}