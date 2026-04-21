'use client';

import { deflateLikes } from "@/lib/mappers";
import { Member } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export function useUpdateMember() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function updateMember(member: Member): Promise<string | null> {
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
            return null;
        }
        return data[0].id;
    }

    return { updateMember, loading, error };
}