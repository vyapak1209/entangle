import { M } from "@/mutators";
import { useEffect } from "react";
import EventSource from "react-native-sse";
import { Replicache } from "replicache";

export function useEventSourcePoke(url: string, rep: Replicache<M> | null) {
    useEffect(() => {

        if (!rep) {
            return
        }

        const ev = new EventSource(url);
        ev.addEventListener("message", async (evt) => {
            if (evt.type !== "message") return;
            if (evt.data === "poke") {
                try {
                    await rep?.pull();
                } catch (e) {
                    console.log('error in pull', e);
                }
            }
        });
        return () => ev.close();
    }, [url, rep]);
}