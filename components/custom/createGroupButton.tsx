'use client'

import { nanoid } from "nanoid"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

/**
 * Component for creating a new group. When clicked, it generates a unique group ID,
 * writes it to the backend, and navigates to the new group page.
 */
export default function CreateGroupButton() {
    const router = useRouter()

    const handleClick = async () => {
        // Generate a unique group ID
        const groupId = nanoid()

        // TODO: Write to backend (async call to create group in database)
        console.log(`Would write to backend Group ID: ${groupId}`)

        // Navigate to the new group page
        router.push(`/group/${groupId}`)
    }

    return (
        <Button onClick={handleClick}>
            Create
        </Button>
    )
}