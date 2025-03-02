import { SimpleGrid } from "@mantine/core";
import ToolCard from "./ToolCard";
import { tools } from "../data";
import { useState } from "react";
import JsonBeautifier from "../tools/JsonBeautifier";
import JsMinifier from "../tools/JsMinifier";

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
