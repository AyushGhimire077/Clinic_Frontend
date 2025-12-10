import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Activity, Save } from "lucide-react";
import { BackButton } from "../../../component/global/components/back/back";
import { inputField } from "../../../component/global/components/customStyle";
import { doctorTypeOptions } from "../../../component/global/utils/global.interface";
import { useToast } from "../../../component/toaster/useToast";
import type { IServicesRequest } from "../services.helper/services.interface";
import { useServicesStore } from "../services.helper/services.store";

const AddService = () => {
  const { showToast } = useToast();
  const { createServices } = useServicesStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<IServicesRequest>({
    name: "",
    description: "",
    charge: 0,
    type: "GENERAL",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "charge" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showToast("Service name is required", "warning");
      return;
    }
    if(!form.charge || form.charge < 0){
      showToast("Charge must be a positive number", "warning");
      return;
    }
    


    setIsLoading(true);

    try {
      const res = await createServices(form);
      showToast(res.message, res.severity);

      if (res.severity === "success") {
        setForm({
          name: "",
          description: "",
          charge: 0,
          type: "GENERAL",

        })
      }
    } catch (error) {
      showToast("Failed to create service", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Add New Service
          </h1>
          <p className="text-muted">Create a new healthcare service</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Service Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., General Consultation, Blood Test"
              className={inputField}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the service..."
              rows={3}
              className={inputField}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Charge */}
            <div>
              <label
                htmlFor="charge"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Charge *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted">Rs. </span>
                <input
                  id="charge"
                  name="charge"
                  type="tel"
                  min="0"
                  value={form.charge}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={inputField + " pl-10"}
                  required
                />
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Service Specific Type
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputField}
              >
                <option value="">Any Staff Type</option>
                {doctorTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isLoading || !form.name.trim()}
              className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Service...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;
