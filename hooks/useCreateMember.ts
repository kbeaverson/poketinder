'use client';

import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import { useState } from "react";

export function useCreateMember() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createMember(groupId: string, name: string): Promise<string | null> {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
            .from("members")
            .insert({ id: nanoid(), name: name, group_id: groupId, likes: []})
            .select()
            .single();
        
        setLoading(false);

        if (error) {
            setError(error.message);
            return null;
        }

        return data.id;
    }

    return { createMember, loading, error };
}