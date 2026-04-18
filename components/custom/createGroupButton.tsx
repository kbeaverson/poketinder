'use client'

import { nanoid } from "nanoid"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { type PokemonPoolName } from "@/lib/pools/champions"

/**
 * Component for creating a new group. When clicked, it generates a unique group ID,
 * writes it to the backend, and navigates to the new group page.
 */
type CreateGroupButtonProps = {
    poolName?: PokemonPoolName
}

export default function CreateGroupButton({ poolName = "CHAMPIONS_MA" }: CreateGroupButtonProps) {
    const router = useRouter()

    const handleClick = async () => {
        // Generate a unique group ID
        const groupId = nanoid()

        // Pass the pool as a query parameter
        const query = new URLSearchParams({
            pool: poolName,
        })

        // TODO: Write to backend (async call to create group in database)
        console.log(`Would write to backend Group ID: ${groupId}`)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate async backend call

        // Navigate to the new group page
        router.push(`/group/${groupId}?${query.toString()}`)
    }

    return (
        <Button onClick={handleClick} variant="outline">
            Create Group
        </Button>
    )
}