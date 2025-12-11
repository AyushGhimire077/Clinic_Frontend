import { useEffect, useState } from "react";
import { Search, ChevronDown, Calendar, User, Stethoscope } from "lucide-react";
import { useEpisodeStore } from "../../episode/helper/episode.store";
import type { IEpisode } from "../../episode/helper/episode.interface";

interface EpisodeSelectProps {
  value: string;
  onChange: (episodeId: string) => void;
  onEpisodeSelect?: (episode: IEpisode | null) => void;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
  patientId?: string;
  showDetails?: boolean;
}

const EpisodeSelect = ({
  value,
  onChange,
  onEpisodeSelect,
  disabled = false,
  label = "Episode",
  required = false,
  error,
  patientId,
  showDetails = true,
}: EpisodeSelectProps) => {
  const { getAllEpisodes, episodeList } = useEpisodeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEpisodes();
  }, []);

  const loadEpisodes = async () => {
    setLoading(true);
    try {
      await getAllEpisodes({ page: 0, size: 100 });
    } finally {
      setLoading(false);
    }
  };

  // Filter episodes
  const filteredEpisodes = episodeList.filter((episode) => {
    if (patientId && episode.patient.id !== patientId) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      searchTerm === "" ||
      episode.title.toLowerCase().includes(searchLower) ||
      episode.patient.name.toLowerCase().includes(searchLower) ||
      (episode.patient.email?.toLowerCase().includes(searchLower) || "") ||
      (episode.patient.contactNumber?.toString().includes(searchTerm) || false)
    );
  });

  const selectedEpisode = episodeList.find((episode) => episode.id === value);

  const handleEpisodeClick = (episode: IEpisode) => {
    onChange(episode.id);
    onEpisodeSelect?.(episode);
    setIsOpen(false);
    setSearchTerm("");
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-700",
      COMPLETED: "bg-blue-100 text-blue-700",
      CANCELLED: "bg-red-100 text-red-700",
      ON_HOLD: "bg-yellow-100 text-yellow-700",
    };
    return colors[status as keyof typeof colors] || "bg-slate-100 text-slate-700";
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      ONE_TIME: "bg-purple-100 text-purple-700",
      RECURRING: "bg-indigo-100 text-indigo-700",
      PACKAGE: "bg-pink-100 text-pink-700",
    };
    return colors[type as keyof typeof colors] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-left border rounded-lg
            ${error ? "border-error" : "border-border"}
            ${disabled ? "bg-surface cursor-not-allowed" : "bg-background"}
            focus:ring-2 focus:ring-primary focus:border-transparent
            transition-colors flex items-center justify-between
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            {selectedEpisode ? (
              <>
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {selectedEpisode.title}
                  </p>
                  {showDetails && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${getTypeBadge(selectedEpisode.type)}`}>
                        {selectedEpisode.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(selectedEpisode.status)}`}>
                        {selectedEpisode.status}
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <span className="text-muted">
                Select {label.toLowerCase()}...
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-elevated max-h-96 overflow-hidden">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search episodes by title, patient name, email, or phone..."
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
              </div>
              {patientId && (
                <p className="text-xs text-muted mt-2">
                  Filtered by patient selection
                </p>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="py-4 text-center">
                  <div className="w-6 h-6 border-2 border-primary-light border-t-primary rounded-full animate-spin mx-auto" />
                </div>
              ) : filteredEpisodes.length === 0 ? (
                <div className="py-8 text-center text-muted">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-muted/30" />
                  No episodes found
                </div>
              ) : (
                filteredEpisodes.map((episode) => (
                  <button
                    key={episode.id}
                    type="button"
                    onClick={() => handleEpisodeClick(episode)}
                    className={`
                      w-full px-4 py-3 text-left transition-colors hover:bg-primary-light/10
                      ${value === episode.id ? "bg-primary-light/20" : ""}
                      border-b border-border last:border-b-0
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${value === episode.id ? "bg-primary-light" : "bg-surface"}`}>
                        <Calendar className={`w-5 h-5 ${value === episode.id ? "text-primary" : "text-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {episode.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-muted" />
                            <span className="text-xs text-muted truncate">
                              {episode.patient.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Stethoscope className="w-3 h-3 text-muted" />
                            <span className="text-xs text-muted truncate">
                              {episode.primaryDoctor.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${getTypeBadge(episode.type)}`}>
                            {episode.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(episode.status)}`}>
                            {episode.status}
                          </span>
                          <span className="text-xs px-2 py-1 bg-surface text-foreground rounded">
                            Rs. {episode.packageCharge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default EpisodeSelect;