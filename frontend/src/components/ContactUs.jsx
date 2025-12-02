import { useState, useContext } from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function ContactUs() {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen p-6`}
    >
      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-6 mb-16"
      >
        <div>
          <label
            className={`${
              darkMode ? "text-gray-400" : "text-gray-700"
            } block text-sm mb-1`}
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={`w-full p-4 rounded-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
            required
          />
        </div>

        <div>
          <label
            className={`${
              darkMode ? "text-gray-400" : "text-gray-700"
            } block text-sm mb-1`}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full p-4 rounded-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
            } focus:ring-2 focus:ring-blue-500 outline-none`}
            required
          />
        </div>

        <div>
          <label
            className={`${
              darkMode ? "text-gray-400" : "text-gray-700"
            } block text-sm mb-1`}
          >
            Message
          </label>
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message..."
            className={`w-full p-4 rounded-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
            } focus:ring-2 focus:ring-blue-500 outline-none resize-none`}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-slate-800 hover:bg-slate-500 rounded-lg font-semibold transition text-white"
        >
          Send Message
        </button>
      </form>

      {/* MODERN MAP + CONTACT INFO */}
      <div className="max-w-6xl mx-auto md:flex md:gap-12">
        {/* MAP */}
        <div className="md:flex-1 md:h-[400px] h-[300px] overflow-hidden rounded-xl shadow-lg">
          <iframe
            title="store-location"
            width="100%"
            height="100%"
            className="rounded-xl"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2576.7434421187274!2d13.001364576535792!3d55.60529350546379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4653a15f1cbf1d8b%3A0xf37bbcc8cf6d802!2sICA%20Supermarket!5e0!3m2!1sen!2sse!4v1700000000000"
          />
        </div>

        {/* CONTACT INFO */}
        <div
          className={`md:flex-1 mt-8 md:mt-0 flex flex-col justify-center p-8 rounded-xl shadow-lg ${
            darkMode ? "bg-gray-800 bg-opacity-80" : "bg-gray-100"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Our Headquarters</h2>
          <p className={darkMode ? "text-gray-300" : "text-gray-900"}>
            Hertig Carls Väg 25B
          </p>
          <p className={darkMode ? "text-gray-300" : "text-gray-900"}>
            151 38 Södertälje, Sweden
          </p>
          <p className={darkMode ? "text-gray-300" : "text-gray-900"}>
            Email: support@supermarket.com
          </p>
          <p className={darkMode ? "text-gray-300" : "text-gray-900"}>
            Phone: +46 123 456 789
          </p>

          <div className="flex gap-6 text-3xl text-blue-400 mt-4">
            <a href="#" className="hover:text-blue-500 transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
