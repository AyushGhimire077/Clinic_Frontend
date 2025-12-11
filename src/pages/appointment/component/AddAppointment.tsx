import type { AlertColor } from "@mui/material";
import { AlertCircle, Calendar, Clock, Plus, User, Stethoscope, Info, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { BackButton } from "../../../component/global/components/back/back";
import { appointmentStatusOptions } from "../../../component/global/utils/global.interface";
import { useToast } from "../../../component/toaster/useToast";
import { getLocalDateTime } from "../../../component/utils/datatime";
import { useEpisodeStore } from "../../episode/helper/episode.store";
import { useAppointmentStore } from "../helper/appointment.store";
import EpisodeSelect from "./EpisodeSelect";
import type { IEpisode } from "../../episode/helper/episode.interface";
import type { IAppointmentRequest } from "../helper/appointment.interface";

const AddAppointment = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { create, update, getAppointmentById } = useAppointmentStore();
    const { getEpisodeById } = useEpisodeStore();
    const [selectedEpisode, setSelectedEpisode] = useState<IEpisode | null>(null);

    const [searchParams] = useSearchParams();
    const episodeId = searchParams.get("episodeId") || "";
    const appointmentId = searchParams.get("appointmentId") || "";


    const nowLocal = getLocalDateTime();

    const [form, setForm] = useState<IAppointmentRequest>({
        episodeId: episodeId,
        scheduledDateTime: nowLocal,
        status: "BOOKED",
        patientId: "",
        doctorId: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditMode, setIsEditMode] = useState(false);

    console.log("selected ep", selectedEpisode)

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                if (appointmentId) {
                    // EDIT MODE: Load existing appointment
                    setIsEditMode(true);
                    const appointment = await getAppointmentById(appointmentId);
                    console.log(appointment.severity)

                    if (appointment.severity === "success" && appointment.data) {
                        console.log("object")
                        const appointmentData = appointment.data;

                        // Load episode details
                        const episodeResponse = await getEpisodeById(appointmentData.episode.id);
                        if (episodeResponse.severity === "success" && episodeResponse.data) {
                            setSelectedEpisode(episodeResponse.data);
                        }

                        // Set form data
                        setForm({
                            episodeId: appointmentData.episode.id,
                            scheduledDateTime: appointmentData.scheduledDateTime,
                            status: appointmentData.status,
                            patientId: appointmentData.patient?.id || appointmentData.episode.patient.id,
                            doctorId: appointmentData.doctor?.id || appointmentData.episode.primaryDoctor.id,
                        });
                    }
                } else if (episodeId) {
                    // AUTO-FILL MODE: Pre-fill from episode ID
                    const episodeResponse = await getEpisodeById(episodeId);
                    if (episodeResponse.severity === "success" && episodeResponse.data) {
                        handleEpisodeSelect(episodeResponse.data);
                    }
                }
            } catch (error) {
                console.error("Error loading data:", error);
                showToast("Failed to load data", "error");
            }
        };

        loadInitialData();
    }, [episodeId, appointmentId]);

    // Handle episode selection
    const handleEpisodeSelect = (episode: IEpisode | null) => {
        setSelectedEpisode(episode);

        if (episode) {
            setForm(prev => ({
                ...prev,
                episodeId: episode.id,
                patientId: episode.patient.id,
                doctorId: episode.primaryDoctor.id,
            }));

            // Clear episode-related errors
            if (errors.episodeId || errors.patientId || errors.doctorId) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.episodeId;
                    delete newErrors.patientId;
                    delete newErrors.doctorId;
                    return newErrors;
                });
            }
        } else {
            // Clear episode data if no episode selected
            setForm(prev => ({
                ...prev,
                episodeId: "",
                patientId: "",
                doctorId: "",
            }));
        }
    };

    // Validation
    const validateForm = () => {
        const err: Record<string, string> = {};

        if (!form.episodeId || form.episodeId.trim() === "") {
            err.episodeId = "Please select an episode";
        }

        if (!form.patientId || form.patientId.trim() === "") {
            err.patientId = "Patient is required";
        }

        if (!form.doctorId || form.doctorId.trim() === "") {
            err.doctorId = "Doctor is required";
        }

        if (!form.scheduledDateTime || form.scheduledDateTime.trim() === "") {
            err.scheduledDateTime = "Date & time is required";
        } else if (new Date(form.scheduledDateTime) < new Date()) {
            err.scheduledDateTime = "Appointment cannot be scheduled in the past";
        }

        if (!form.status || !appointmentStatusOptions.find(o => o.value === form.status)) {
            err.status = "Please select a valid status";
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    // Change Handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast("Please fix the errors in the form", "warning");
            return;
        }

        setLoading(true);
        try {
            let res;

            if (isEditMode && appointmentId) {
                res = await update(appointmentId, form);
            } else {
                res = await create(form);
            }

            showToast(res.message, res.severity as AlertColor);

            if (res.severity.toUpperCase() === "SUCCESS") {
                navigate("/appointment/view-appointment");
            }
        } catch (error) {
            console.error("Appointment error:", error);
            showToast("Something went wrong. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (hasError: boolean) =>
        `w-full px-4 py-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary 
    focus:border-transparent transition-colors ${hasError ? "border-error focus:ring-error/30" : "border-border"
        }`;

    return (
        <div className="min-h-screen bg-background ">
            <div className="max-w-4xl mx-auto">
                <BackButton />

                <div className="bg-surface mt-6 rounded-lg shadow-soft border border-border overflow-hidden">
                    {/* Header */}
                    <div className="bg-linear-to-r from-primary to-primary-dark px-6 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    {isEditMode ? "Edit Appointment" : "Schedule Appointment"}
                                </h1>
                                <p className="text-primary-light text-sm mt-1">
                                    {isEditMode
                                        ? "Update appointment details"
                                        : episodeId
                                            ? "Auto-filling from episode"
                                            : "Schedule a new appointment"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Mode Indicator */}
                        {episodeId && !isEditMode && (
                            <div className="mb-6 p-4 bg-primary-light/10 rounded-lg border border-primary/20">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium text-foreground">Auto-fill Mode</p>
                                        <p className="text-sm text-muted mt-1">
                                            Appointment is being created for episode ID: <code className="bg-surface px-2 py-1 rounded">{episodeId}</code>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Episode Selection - Only show if not auto-filled from URL */}
                        {!episodeId && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-4">Episode Selection</h3>
                                <EpisodeSelect
                                    value={form.episodeId}
                                    onChange={(episodeId) => {
                                        setForm(prev => ({ ...prev, episodeId }));
                                        if (errors.episodeId) {
                                            setErrors(prev => ({ ...prev, episodeId: "" }));
                                        }
                                    }}
                                    onEpisodeSelect={handleEpisodeSelect}
                                    label="Select Episode"
                                    required
                                    error={errors.episodeId}
                                />

                                {errors.episodeId && (
                                    <p className="text-sm text-error mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.episodeId}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Selected Episode Info */}
                        {selectedEpisode && (
                            <div className="mb-6 bg-surface rounded-lg border border-border p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-foreground">Selected Episode Details</h3>
                                    <span className={`text-xs px-2 py-1 rounded ${selectedEpisode.status === "ACTIVE"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-slate-100 text-slate-700"
                                        }`}>
                                        {selectedEpisode.status}
                                    </span>
                                </div>

                                {/* Patient Details */}
                                <div className="mb-4 p-3 bg-primary-light/5 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-primary" />
                                        <span className="font-medium text-sm text-foreground">Patient Information</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <p className="font-medium text-foreground">{selectedEpisode.patient.name}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Phone className="w-3 h-3 text-muted" />
                                                <span className="text-xs text-muted">
                                                    {selectedEpisode.patient.contactNumber || "No phone"}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-3 h-3 text-muted" />
                                                <span className="text-xs text-muted truncate">
                                                    {selectedEpisode.patient.email || "No email"}
                                                </span>
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-surface text-foreground rounded mt-1 inline-block">
                                                {selectedEpisode.patient.gender || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                    <input type="hidden" name="patientId" value={form.patientId} />
                                </div>

                                {/* Doctor Details */}
                                <div className="p-3 bg-surface rounded-lg border border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Stethoscope className="w-4 h-4 text-primary" />
                                        <span className="font-medium text-sm text-foreground">Doctor Information</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <p className="font-medium text-foreground">{selectedEpisode.primaryDoctor.name}</p>
                                            <span className="text-xs text-muted">
                                                {selectedEpisode.primaryDoctor.role || "Doctor"}
                                            </span>
                                        </div>
                                        <div>
                                            {selectedEpisode.primaryDoctor.doctorSubType && (
                                                <span className="text-xs px-2 py-1 bg-primary-light text-primary rounded">
                                                    {selectedEpisode.primaryDoctor.doctorSubType}
                                                </span>
                                            )}
                                            <div className="mt-1">
                                                <span className="text-xs text-muted">
                                                    ID: {form.doctorId.substring(0, 8)}...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" name="doctorId" value={form.doctorId} />
                                </div>

                                {/* Episode Details */}
                                <div className="mt-4 pt-4 border-t border-border">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs px-2 py-1 bg-surface text-foreground rounded border border-border">
                                            {selectedEpisode.type}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-surface text-foreground rounded border border-border">
                                            {selectedEpisode.billingMode}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-surface text-foreground rounded border border-border">
                                            Rs. {selectedEpisode.packageCharge}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-surface text-foreground rounded border border-border">
                                            {selectedEpisode.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Patient & Doctor Validation Errors */}
                        {(errors.patientId || errors.doctorId) && (
                            <div className="mb-6 p-4 bg-error/5 rounded-lg border border-error/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="w-5 h-5 text-error" />
                                    <span className="font-medium text-error">Missing Information</span>
                                </div>
                                <div className="space-y-1">
                                    {errors.patientId && (
                                        <p className="text-sm text-error">• {errors.patientId}</p>
                                    )}
                                    {errors.doctorId && (
                                        <p className="text-sm text-error">• {errors.doctorId}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Appointment Details */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Date & Time *
                                        </label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-3.5 w-5 h-5 text-muted pointer-events-none" />
                                            <input
                                                type="datetime-local"
                                                name="scheduledDateTime"
                                                value={form.scheduledDateTime}
                                                onChange={handleChange}
                                                className={`${inputClasses(!!errors.scheduledDateTime)} pl-10`}
                                                min={nowLocal}
                                            />
                                        </div>
                                        {errors.scheduledDateTime && (
                                            <p className="text-sm text-error mt-2 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.scheduledDateTime}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Status *
                                        </label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className={inputClasses(!!errors.status)}
                                        >
                                            {appointmentStatusOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.status && (
                                            <p className="text-sm text-error mt-2 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Hidden fields for patientId and doctorId */}
                            <input type="hidden" name="patientId" value={form.patientId} />
                            <input type="hidden" name="doctorId" value={form.doctorId} />

                            {/* Submit Button */}
                            <div className="pt-6 border-t border-border">
                                <button
                                    type="submit"
                                    disabled={loading || !selectedEpisode}
                                    className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {isEditMode ? "Updating..." : "Scheduling..."}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            {isEditMode ? "Update Appointment" : "Schedule Appointment"}
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-muted text-center mt-3">
                                    {!selectedEpisode
                                        ? "Please select an episode to continue"
                                        : "All fields marked with * are required"}
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAppointment;