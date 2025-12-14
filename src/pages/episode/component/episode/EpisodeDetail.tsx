import { useParams } from "react-router-dom";
import { useEpisodeStore } from "../../helper/episode.store";
import { useEffect, useState } from "react";

const EpisodeDetail = () => {

    const id = useParams<{ id: string }>().id;

    const { getEpisodeById } = useEpisodeStore();
    const [loading, setLoading] = useState(false);


    const getById = async (id: string) => {
        setLoading(true);
        try {

        } catch (e) {
        }
    }

    useEffect(() => {
        if (id) {
            getEpisodeById(id);
        }
    }, [id, getEpisodeById]);

    return <div>Episode Detail Page</div>;
}

export default EpisodeDetail;