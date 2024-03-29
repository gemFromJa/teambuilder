/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "button-gray": "#cacaca",
                "field-color": "#0f9d58",
                "dark-gray": "#616161",
                blue: "#0c6eb9",
                "content-bg": "#ffffff",
            },
        },
    },
    plugins: [],
};
