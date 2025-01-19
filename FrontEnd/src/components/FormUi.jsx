import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";

const FormUi = ({
  title,
  onSubmit,
  fields,
  formData,
  handleChange,
  error,
  isLoading = false,
  submitButtonText,
  loadingText = "Processing...",
  redirectText,
  redirectLinkText,
  redirectPath,
}) => {
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            {fields.map((field, index) => {
              if (field.name === "password") {
                return (
                  <div key={field.name}>
                    <PasswordInput
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      placeholder={field.placeholder}
                    />
                  </div>
                );
              }
              return (
                <div key={field.name}>
                  <input
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    className={`appearance-none rounded-none relative block w-[100%] px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                      index === 0 ? "rounded-t-md" : ""
                    } ${index === fields.length - 1 ? "rounded-b-md" : ""}`}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  />
                </div>
              );
            })}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? loadingText : submitButtonText}
            </button>
          </div>

          {redirectText && (
            <div className="text-center">
              <span className="text-gray-600">{redirectText} </span>
              <button
                type="button"
                onClick={() => navigate(redirectPath)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                {redirectLinkText}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

FormUi.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      required: PropTypes.bool.isRequired,
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  submitButtonText: PropTypes.string.isRequired,
  loadingText: PropTypes.string,
  redirectText: PropTypes.string,
  redirectLinkText: PropTypes.string,
  redirectPath: PropTypes.string,
};

export default FormUi;
