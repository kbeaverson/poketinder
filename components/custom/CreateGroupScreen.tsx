'use client';

import { useState } from "react";

import CreateGroupButton from "./CreateGroupButton";
import { Input } from "../ui/input";

export default function CreateGroupScreen() {
    const [groupName, setGroupName] = useState("");

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-zinc-50 font-sans dark:bg-black">
            <h1 className="text-6xl font-bold mb-4">Poketinder</h1>
            <h2 className="text-1xl font-bold mb-8">Pick a group name and get swiping</h2>
            <div className="flex flex-row">
                {/* Input field for group name */}
                <Input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="bg-zinc-200 text-zinc-800 placeholder:text-zinc-500 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter group name"
                />
                <CreateGroupButton groupName={groupName} />
            </div>
        </div>
    )
}