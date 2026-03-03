/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                glass: {
                    surface: "rgba(255, 255, 255, 0.1)",
                    border: "rgba(255, 255, 255, 0.2)",
                    shine: "rgba(255, 255, 255, 0.5)",
                }
            }
        },
    },
    plugins: [],
}
