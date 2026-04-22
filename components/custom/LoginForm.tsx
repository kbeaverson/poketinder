'use client';

import { Button } from "../ui/button";
import { useState } from "react";
import { useOrCreateMember } from "@/hooks/useOrCreateMember";
import { LocalPokemon, Member } from "@/lib/types";
import { Input } from "../ui/input";

type LoginFormProps = {
    groupId: string,
    pool: LocalPokemon[],
    handleLoginSuccess: (member: Member) => void,
}

export default function LoginForm({ groupId, pool, handleLoginSuccess }: LoginFormProps) {
    const { getOrCreateMember, loading, error } = useOrCreateMember();
    const [name, setName] = useState('');

    const handleJoin = async () => {
        const member = await getOrCreateMember(groupId, name, pool);
        if (member) {
            setName(name);
            handleLoginSuccess(member);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <p>Please enter your name to start swiping.</p>
            <div className="flex flex-row py-4">
                {/* Input field for name */}
                <Input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                {/* Button to submit name and join group */}
                <Button onClick={handleJoin} disabled={loading}>
                    {loading ? 'Joining...' : 'Join Group'}
                </Button>
            </div>
            {error && <p>Error joining group: {error}</p>}
        </div>
    );
}