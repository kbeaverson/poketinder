'use client';

import { mapGroupRow } from "@/lib/mappers";
import { Group, LocalPokemon } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function useGroup(groupId: string, pokemonPool: LocalPokemon[]) {
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

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
    }, [groupId, pokemonPool]);

    return { group, loading, error };
}