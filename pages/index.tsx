import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/game/");
    }, []);
    return (
        <>
            <center className="text-4xl mt-[30%]">Coming Soon!!</center>
        </>
    );
}
