import { SimpleGrid } from "@mantine/core";
import ToolCard from "./ToolCard";
import { tools } from "../data";
import { useState } from "react";
import JsonBeautifier from "../tools/JsonBeautifier";
import JsMinifier from "../tools/JsMinifier";
import SQLFormatter from "../tools/SQLFormatter";
import XmlFormatter from "../tools/XmlFormatter";
import UuidGenerator from "../tools/UuidGenerator";
import PasswordGenerator from "../tools/PasswordGenerator";
import Base64Tool from "../tools/Base64Tool";
import JWTVerifierTool from "../tools/JWTVerifierTool";

function ToolsGrid() {
  const [activeTool, setActiveTool] = useState(null);

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case "json-beautifier":
        return <JsonBeautifier onBack={() => setActiveTool(null)} />;
      case "js-minifier":
        return <JsMinifier onBack={() => setActiveTool(null)} />;
      case "sql-formatter":
        return <SQLFormatter onBack={() => setActiveTool(null)} />;
      case "xml-formatter":
        return <XmlFormatter onBack={() => setActiveTool(null)} />;
      case "uuid-generator":
        return <UuidGenerator onBack={() => setActiveTool(null)} />;
      case "password-generator":
        return <PasswordGenerator onBack={() => setActiveTool(null)} />;
      case "base64-enc-dec":
        return <Base64Tool onBack={() => setActiveTool(null)} />;
      case "jwt-verify":
        return <JWTVerifierTool onBack={() => setActiveTool(null)} />;
      default:
        return (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onClick={handleToolClick} />
            ))}
          </SimpleGrid>
        );
    }
  };

  return renderActiveTool();
}

export default ToolsGrid;
