import React, { useContext, useEffect, useState } from "react";
import { ActionContext } from "../../contexts/ActionContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SelectBox from "./SelectBox";
import { data, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { date } from "yup";
import { showErrorToast, showSuccessToast } from "../../../lib/Toast";

const initialValues = {
  issue_building: "",
  issue_floor: "",
  issue_apartment: "",
  issue_profession: "",
  issue_description: "",
};

function IssueForm() {
  const { iss, setIss } = useContext(ActionContext);
  const [values, setValues] = useState(initialValues);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ["edit issue"],
    mutationFn: async ({ values, id }) =>
      await axios.put(`issues/update/${id}`, values),
    onSuccess: (data) => {
    
      document.getElementById("issue_modal").close();
      queryClient.invalidateQueries({
        queryKey: ["get_issues"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my_issues"],
      });
      showSuccessToast("Issue updated successfully");
      setIss(null);
    },

    onError: (error) => {
      console.error(
        "Error adding issue:",
        error.response?.data || error.message
      );
      document.getElementById("issue_modal").close();
      showErrorToast("Error updating issue");
    },
  });

  const { mutate: addMutate } = useMutation({
    mutationKey: ["add_issue"],
    mutationFn: async (formData) =>
      await axios.post("/issues/addIssues", formData),
    onSuccess: (data) => {
      console.log("Issue added successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["get_issues"] });
      showSuccessToast("Issue added successfully");
      // setUploadedFiles([]);

      setIss(null);
      navigate("/allissues");
    },
    onError: (error) => {
      console.error(
        "Error adding issue:",
        error.response?.data || error.message
      );
      showErrorToast("Error adding issue");
    },
  });

  function handleChange(e) {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  }

  function handlesubmit(e) {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      uploadedFiles.forEach(({ file }) => {
        formData.append("issue_images", file);
      });
      iss ? mutate({ values, id: values?._id }) : addMutate(formData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!iss) return setValues(initialValues);

    setValues({ ...iss });
  }, [iss]);

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadedFiles((prev) => [
      ...prev,
      ...newFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
      })),
    ]);
    e.target.value = "";
  };

  function handleCancel() {
    if (!iss) {
      navigate("/allissues");
    } else {
      document.getElementById("issue_modal").close();
      setIss(null);
    }
  }
  return (
    <div className=" w-full p-4 flex items-center justify-center ">
      <div className="bg-orange-50 p-4 md:p-6 rounded-2xl shadow-lg w-full max-w-4xl h-[85vh] flex flex-col">
        {/* כותרת */}
        <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-2 md:mb-2 text-center">
          {!iss ? "Add Issue" : "Edit Issue"}
        </h2>

        <form onSubmit={handlesubmit} className="flex-1 overflow-y-aut">
          <div className="space-y-4 bg-white p-4 md:p-6 rounded-xl shadow-sm">
            {/* Location and Basic Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label
                  className="block text-sm font-medium text-amber-700 mb-1"
                  htmlFor="building"
                >
                  Building
                </label>
                <select
                  className="w-full rounded-lg border-2 border-amber-200 bg-amber-50 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  id="building"
                  name="issue_building"
                  value={values?.issue_building || ""}
                  onChange={handleChange}
                  required
                  // disabled={!!iss}
                >
                  <option value="">Select Building</option>
                  <option value="A">Building A</option>
                  <option value="B">Building B</option>
                  <option value="C">Building C</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-amber-700 mb-1"
                  htmlFor="floor"
                >
                  Floor
                </label>
                <select
                  className="w-full rounded-lg border-2 border-amber-200 bg-amber-50 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  id="floor"
                  name="issue_floor"
                  value={values?.issue_floor || ""}
                  onChange={handleChange}
                  required
                  // disabled={!!iss}
                >
                  <option value="">Select Floor</option>
                  <option value="1">1st Floor</option>
                  <option value="2">2nd Floor</option>
                  <option value="3">3rd Floor</option>
                  <option value="4">4th Floor</option>
                  <option value="5">5th Floor</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-amber-700 mb-1"
                  htmlFor="apartment"
                >
                  Apartment
                </label>
                <input
                  type="text"
                  id="apartment"
                  name="issue_apartment"
                  value={values?.issue_apartment || ""}
                  onChange={handleChange}
                  required
                  // disabled={!!iss}
                  placeholder="Enter apartment number"
                  className="w-full rounded-lg border-2 border-amber-200 bg-amber-50 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-amber-700 mb-1"
                  htmlFor="profession"
                >
                  Profession
                </label>
                <SelectBox
                  value={
                    values?.issue_profession._id || values?.issue_profession || ""
                  }
                  handleChange={handleChange}
                  id={"issue_profession"}
                />
              </div>
              {/* Urgency Selection */}
              <div>
                <label
                  className="block text-sm font-medium text-amber-700 mb-1"
                  htmlFor="urgency"
                >
                  Urgency Level
                </label>
                <select
                  className="w-full rounded-lg border-2 border-amber-200 bg-amber-50 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  id="urgency"
                  name="issue_urgency"
                  value={values?.issue_urgency || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              {iss && (
                <div>
                  <label
                    className="block text-sm font-medium text-amber-700 mb-1"
                    htmlFor="urgency"
                  >
                    status
                  </label>
                  <select
                    className="w-full rounded-lg border-2 border-amber-200 bg-amber-50 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    id="status"
                    name="issue_status"
                    value={values?.issue_status || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="New">New</option>
                    <option value="In process">In process</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-medium text-amber-700 mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="issue_description"
                value={values?.issue_description || ""}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-2 border-amber-200 bg-amber-50 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Please describe the issue in detail..."
                rows="3"
              ></textarea>
            </div>

            {/* Image Upload with Fixed Height */}
            {!iss && (
              <div>
                <label className=" block text-sm font-medium text-amber-700 mb-1">
                  Add Images
                </label>
                <div className="mt-1  h-32 border-2 border-amber-200 border-dashed rounded-lg bg-amber-50">
                  <div className="px-4 py-4">
                    <div className="text-center">
                      <div className=" flex text-sm text-amber-600 justify-center">
                        <label
                          htmlFor="issue_images"
                          className="  relative cursor-pointer rounded-md font-medium text-amber-600 hover:text-amber-800"
                        >
                          <span>Upload a file</span>
                          <input
                            id="issue_images"
                            name="issue_images"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-amber-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>

                    {/* Scrollable uploaded files container */}
                    {uploadedFiles.length > 0 && (
                      <div className=" overflow-auto h-10 mt-1 max-h-32 overflow-y-auto">
                        <div className="space-y-2">
                          {uploadedFiles.map(({ id, file }) => (
                            <div
                              key={id}
                              className="flex items-center justify-between bg-white p-1 rounded-sm"
                            >
                              <span className="text-sm text-amber-700 truncate max-w-[80%]">
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(id)}
                                className="text-amber-500 hover:text-amber-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                className="px-6 py-2 border-2 border-amber-600 text-amber-600 rounded-xl hover:bg-amber-50 focus:outline-none focus:ring-2
               focus:ring-amber-500 focus:ring-offset-2 transition-colors
                duration-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-600 text-white 
              rounded-xl hover:bg-amber-700 focus:outline-none
               focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                transition-colors duration-200"
                // disabled={mutation.isLoading}
              >
                {!iss ? "Add Issue" : "Edit Issue"}
                {/* {mutation.isLoading ? "Submitting..." : "Submit Issue"} */}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IssueForm;
