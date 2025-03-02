import { Card, Text, Group, Badge, useMantineColorScheme } from "@mantine/core";

function ToolCard({ tool, onClick }) {
  const { colorScheme } = useMantineColorScheme();
  const Icon = tool.icon;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={() => onClick(tool.id)}
      style={{ cursor: "pointer" }}
      bg={colorScheme === "dark" ? "dark.7" : "gray.0"}
    >
      <Group justify="space-between" mb="xs">
        <Group>
          <Icon size={24} />
          <Text fw={700}>{tool.title}</Text>
        </Group>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        {tool.description}
      </Text>

      <Group gap="xs">
        {tool.tags.map((tag) => (
          <Badge key={tag} size="sm">
            #{tag}
          </Badge>
        ))}
      </Group>
    </Card>
  );
}

export default ToolCard;
