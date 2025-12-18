import { useParams } from "react-router-dom";
import { useEpisodeStore } from "../../helper/episode.store";
import { useEffect, useState } from "react";
import { useToast } from "../../../../component/toaster/useToast";
import type { IEpisode } from "../../helper/episode.interface";

const EpisodeDetail = () => {

    const id = useParams<{ id: string }>().id;

    const { getEpisodeById } = useEpisodeStore();
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [episode, setEpisode] = useState<IEpisode | null>(null);


    const getById = async (id: string) => {
        setLoading(true);
        try {
            const res = await getEpisodeById(id);
            if (res.data.status !== 200) {
                showToast("Error", res.data.message);
                return res.data.data;
            }

            setEpisode(res.data.data);

        } catch (e) {
            showToast("Error", "Failed to fetch episode details.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            getById(id);
        }
    }, [id, getById]);

    return <div>Episode Detail Page</div>;
}

export default EpisodeDetail;