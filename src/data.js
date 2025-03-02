import {
  IconCode,
  IconBraces,
  IconSql,
  IconFileTypeXml,
} from "@tabler/icons-react";

export const tools = [
  {
    id: "json-beautifier",
    title: "JSON Beautifier",
    description: "Format and beautify JSON data for better readability",
    icon: IconBraces,
    tags: ["json", "formatter"],
  },
  {
    id: "js-minifier",
    title: "JS Minifier",
    description: "Minify JavaScript code to reduce file size",
    icon: IconCode,
    tags: ["javascript", "minifier"],
  },
  {
    id: "sql-formatter",
    title: "SQL Formatter",
    description: "Format SQL code to make it more readable",
    icon: IconSql,
    tags: ["sql", "formatter"],
  },
  {
    id: "xml-formatter",
    title: "XML Formatter",
    description: "Format XML code to make it more readable",
    icon: IconFileTypeXml,
    tags: ["xml", "formatter"],
  },
  // Add more tools here as needed
];
