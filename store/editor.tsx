import { useState } from "react";

export default function EditorState() {
    const [selectedPlayer, setSelectedPlayer] = useState<number[]>([]);

    return {
        selectedPlayer,
        setSelectedPlayer,
    };
}
