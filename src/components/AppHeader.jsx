import { Group, TextInput, Tabs } from "@mantine/core";
import { IconTools, IconCode, IconSearch } from "@tabler/icons-react";
import ThemeToggle from "./ThemeToggle";

function AppHeader({ activeTab, setActiveTab }) {
  return (
    <Group px="md" h="100%" justify="space-between">
      <Group>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="tools" leftSection={<IconTools size={16} />}>
              Tools
            </Tabs.Tab>
            {/* <Tabs.Tab value="snippets" leftSection={<IconCode size={16} />}>
              Snippets
            </Tabs.Tab> */}
          </Tabs.List>
        </Tabs>
      </Group>
      <Group>
        <TextInput
          placeholder="Search for a tool..."
          leftSection={<IconSearch size={16} />}
          w={250}
        />
        <ThemeToggle />
      </Group>
    </Group>
  );
}

export default AppHeader;
