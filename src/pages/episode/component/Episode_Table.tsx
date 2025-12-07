import { useGlobalStore } from "../../../component/toaster/store";
import { useEpisodeStore } from "./helper/store";

const EpisodeTable = () => {

    const { getAllEpisodes, episodeList} = useEpisodeStore();
    const { setToasterData} = useGlobalStore();

  return <div>Episode Table Component</div>;
}