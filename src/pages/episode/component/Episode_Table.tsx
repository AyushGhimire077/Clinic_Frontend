import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../component/toaster/toast.store";
import type { IEpisode } from "./helper/interface";
import { useEpisodeStore } from "./helper/store";

const EpisodeTable = () => {
  const { getAllEpisodes, episodeList } = useEpisodeStore();
  const { setToasterData } = useGlobalStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        await getAllEpisodes({ page: 0, size: 100 });
      } catch (err) {
        setToasterData({
          message: "Failed to fetch episodes",
          severity: "error",
          open: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, []);

  const handleEdit = (episode: IEpisode) => {
    navigate(`/episodes/edit/${episode.id}`, { state: { episode } });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "CLOSED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Episodes</h1>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : episodeList.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No episodes found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-200 rounded-lg">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Billing</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Doctor</th>
                <th className="px-4 py-2 text-left">Charge</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {episodeList.map((ep: IEpisode) => (
                <tr key={ep.id} className="border-t border-slate-200">
                  <td className="px-4 py-2">{ep.title}</td>
                  <td className="px-4 py-2">{ep.type}</td>
                  <td className="px-4 py-2">{ep.billingMode}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        ep.status
                      )}`}
                    >
                      {ep.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    Dr. {ep.primaryDoctor.name} (
                    {ep.primaryDoctor.doctorSubType || "General"})
                  </td>
                  <td className="px-4 py-2">
                    NPR {ep.packageCharge.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(ep)}
                      className="px-3 py-1 text-white bg-teal-600 rounded-md hover:bg-teal-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EpisodeTable;
