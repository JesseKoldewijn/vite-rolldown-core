/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options & import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  // Import sorting
  importOrder: ["^~/(.*)$", "^~/(.css)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  // Tailwind
  tailwindAttributes: ["className"],
  tailwindFunctions: ["clsx", "cn", "twMerge"],
};

export default config;
