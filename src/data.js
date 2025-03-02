import {
  IconCode,
  IconBraces,
  IconSql,
  IconFileTypeXml,
  IconNumber,
  IconPassword,
  IconSourceCode,
  IconFocusAuto,
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
  {
    id: "uuid-generator",
    title: "UUID Generator",
    description: "Generate Unique UUID",
    icon: IconNumber,
    tags: ["uuid", "generator"],
  },
  {
    id: "password-generator",
    title: "Random Password Generator",
    description: "Generate Unique Random Passwords",
    icon: IconPassword,
    tags: ["password", "generator"],
  },
  {
    id: "base64-enc-dec",
    title: "Base64 Encoder/Decoder",
    description: "Text -> Base64 Encoder/Decoder -> Text",
    icon: IconSourceCode,
    tags: ["encode", "decode"],
  },
  {
    id: "jwt-verify",
    title: "Verify JWT Token",
    description: "Verify JWT token credentials",
    icon: IconFocusAuto,
    tags: ["jwt", "token", "auth"],
  },
];
