import { useNavigate } from "react-router-dom";
import logo from "../assets/allo-purple-logo.webp"

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-600">Welcome to Allo Health</h1>
        <p className="text-xl mt-2 text-gray-700">Comprehensive STI Diagnosis & Care</p>
      </header>

      <div className="mb-10">
        <img
          src={logo}
          alt="Health and Care"
          className="rounded-lg shadow-md w-full max-w-md mx-auto"
        />
      </div>

      <div className="text-center max-w-lg mx-auto">
        <p className="text-lg text-gray-600">
          At Allo Health, we understand the importance of sexual health. Our experienced healthcare professionals guide you through
          the testing process. We partner with trusted third-party labs to ensure accurate and confidential STI diagnoses.
        </p>
        <p className="text-lg text-gray-600 mt-4">
          We test for a range of STIs, including Chlamydia, Gonorrhoea, Syphilis, and more. Once your results are ready, we provide
          you with the necessary medical advice and treatment options.
        </p>
      </div>

      <div className="mt-10 flex justify-center space-x-4">
        <button
          onClick={() => handleNavigate("/login")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
        >
          Login
        </button>
        <button
          onClick={() => handleNavigate("/doctor/register")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
        >
          Sign Up as Doctor
        </button>
        <button
          onClick={() => handleNavigate("/patient/register")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
        >
          Sign Up as Patient
        </button>
      </div>

      <footer className="mt-12 text-center text-gray-500">
        <p>&copy; 2025 Allo Health. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
