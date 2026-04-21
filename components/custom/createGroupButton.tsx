'use client'

import { nanoid } from "nanoid"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { type PokemonPoolName } from "@/lib/pools/champions"
import { useCreateGroup } from "@/hooks/useCreateGroup"

/**
 * Component for creating a new group. When clicked, it generates a unique group ID,
 * writes it to the backend, and navigates to the new group page.
 */
type CreateGroupButtonProps = {
    poolName?: PokemonPoolName
}

export default function CreateGroupButton({ poolName = "CHAMPIONS_MA" }: CreateGroupButtonProps) {
    const { createGroup, loading, error } = useCreateGroup()
    const router = useRouter()

    const handleClick = async () => {
        // Pass the pool as a query parameter
        const query = new URLSearchParams({
            pool: poolName,
        })

        // TODO: Add group naming functionality
        const groupId = await createGroup('', poolName);

        // Navigate to the new group page
        router.push(`/group/${groupId}?${query.toString()}`)
    }

    return (
        <Button onClick={handleClick} variant="outline">
            Create Group
        </Button>
    )
}