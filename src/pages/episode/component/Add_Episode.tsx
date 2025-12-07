import { useGlobalStore } from "../../../component/toaster/store";
import { useEpisodeStore } from "./helper/store";

const AddEpisode = () => {

    const { createEpisode} = useEpisodeStore();
    const  { setToaster }  = useGlobalStore();

  return (

     <div>Add Episode Component</div>

  );
};

export default AddEpisode;