type Props = {
    params: {
        id: string
    }
}

export default function GroupPage({ params }: Props) {
    return (
        <div>
            <h1>Group ID: {params.id}</h1>
            {/* Fetch and display group details using the ID */}
        </div>
    )
}