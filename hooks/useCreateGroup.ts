'use client';

import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import { useState } from "react";

export function useCreateGroup() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createGroup(name: string, poolName: string): Promise<string | null> {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
            .from("groups")
            .insert({ id: nanoid(), name, poolName })
            .select()
            .single();

        setLoading(false);

        if (error) {
            setError(error.message);
            return null;
        }

        return data.id;
    }

    return { createGroup, loading, error };
}