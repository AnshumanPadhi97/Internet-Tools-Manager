import { AppShell, Container } from "@mantine/core";
import AppHeader from "./components/AppHeader";
import ToolsGrid from "./components/ToolsGrid";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("tools");

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <AppHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      </AppShell.Header>
      <AppShell.Main pt={80}>
        <Container size="xl">
          <ToolsGrid />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
