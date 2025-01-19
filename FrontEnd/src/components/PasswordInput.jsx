import { useState } from "react";
import PropTypes from "prop-types";

const PasswordInput = ({ value, onChange, name, required, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="appearance-none rounded-none relative block w-[100%] px-3 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
      />
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 z-20"
        onClick={togglePasswordVisibility}
        style={{ cursor: "pointer" }}
      >
        {showPassword ? (
          <span className="text-gray-500">Hide</span>
        ) : (
          <span className="text-gray-500">Show</span>
        )}
      </div>
    </div>
  );
};

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
};

PasswordInput.defaultProps = {
  required: false,
  placeholder: "Enter your password",
};

export default PasswordInput;
