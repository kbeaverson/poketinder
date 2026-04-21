'use client';

import { mapMemberRow } from "@/lib/mappers";
import { LocalPokemon } from "@/lib/types";
import { Member } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function useMember(memberId: string, pool: LocalPokemon[]) {
    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

        supabase
            .from("members")
            .select(`id, name, group_id, likes, created_at`)
            .eq("id", memberId)
            .single()
            .then(({ data, error }) => {
                if (error) {
                    setError(error.message);
                } else if (data) {
                    setMember(mapMemberRow(data, pool));
                }
                setLoading(false);
            });
    }, [memberId, pool]);

    return { member, loading, error };
}