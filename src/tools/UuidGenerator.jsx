import { useState } from "react";
import {
  Button,
  Group,
  Title,
  Paper,
  Text,
  CopyButton,
  Grid,
  Select,
  NumberInput,
  Stack,
  Checkbox,
  Code,
  Alert,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCopy,
  IconCheck,
  IconRefresh,
} from "@tabler/icons-react";
import { v1 as uuidv1, v4 as uuidv4 } from "uuid";

function UuidGenerator({ onBack }) {
  const [uuids, setUuids] = useState([]);
  const [error, setError] = useState("");

  const [options, setOptions] = useState({
    version: "v4",
    quantity: 5,
    format: "default",
    uppercase: false,
    hyphens: true,
  });

  const generateUuids = () => {
    try {
      const quantity = Math.min(100, Math.max(1, options.quantity));
      const newUuids = [];

      for (let i = 0; i < quantity; i++) {
        let uuid = options.version === "v4" ? uuidv4() : uuidv1();

        if (!options.hyphens) {
          uuid = uuid.replace(/-/g, "");
        }

        if (options.uppercase) {
          uuid = uuid.toUpperCase();
        }

        if (options.format === "braces") {
          uuid = `{${uuid}}`;
        } else if (options.format === "parentheses") {
          uuid = `(${uuid})`;
        }

        newUuids.push(uuid);
      }

      setUuids(newUuids);
      setError("");
    } catch (err) {
      setError("Error generating UUIDs: " + err.message);
      setUuids([]);
    }
  };

  const handleOptionChange = (name, value) => {
    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Paper p="md">
      <Group mb="md">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onBack}
        >
          Back to Tools
        </Button>
      </Group>
      <Group mb="md">
        <Title order={3}>UUID Generator</Title>
      </Group>

      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md">
            <Stack spacing="md">
              <Title order={4}>Options</Title>

              <Select
                label="UUID Version"
                defaultValue="v4"
                onChange={(value) => handleOptionChange("version", value)}
                data={[
                  { value: "v4", label: "Version 4 (Random)" },
                  { value: "v1", label: "Version 1 (Timestamp-based)" },
                ]}
              />

              <NumberInput
                label="Quantity"
                description="Number of UUIDs to generate (1-100)"
                value={options.quantity}
                onChange={(value) => handleOptionChange("quantity", value)}
                min={1}
                max={100}
              />

              <Select
                label="Format"
                defaultValue="default"
                onChange={(value) => handleOptionChange("format", value)}
                data={[
                  { value: "default", label: "Plain" },
                  { value: "braces", label: "With Braces {}" },
                  { value: "parentheses", label: "With Parentheses ()" },
                ]}
              />

              <Group>
                <Checkbox
                  label="Uppercase"
                  checked={options.uppercase}
                  onChange={(e) =>
                    handleOptionChange("uppercase", e.currentTarget.checked)
                  }
                />

                <Checkbox
                  label="Include hyphens"
                  checked={options.hyphens}
                  onChange={(e) =>
                    handleOptionChange("hyphens", e.currentTarget.checked)
                  }
                />
              </Group>

              <Group>
                <Button
                  onClick={generateUuids}
                  leftSection={<IconRefresh size={16} />}
                >
                  Generate UUIDs
                </Button>

                {uuids.length > 0 && (
                  <CopyButton value={uuids.join("\n")} timeout={2000}>
                    {({ copied, copy }) => (
                      <Button
                        color={copied ? "teal" : "blue"}
                        onClick={copy}
                        leftSection={
                          copied ? (
                            <IconCheck size={16} />
                          ) : (
                            <IconCopy size={16} />
                          )
                        }
                      >
                        {copied ? "Copied All" : "Copy All"}
                      </Button>
                    )}
                  </CopyButton>
                )}
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text weight={500} mb="xs">
            Generated UUIDs:
          </Text>
          <Paper
            withBorder
            p="md"
            h={380}
            style={{
              overflowY: "auto",
              backgroundColor: uuids.length ? undefined : "rgba(0, 0, 0, 0.03)",
            }}
          >
            {uuids.length > 0 ? (
              <Stack spacing="xs">
                {uuids.map((uuid, index) => (
                  <Group key={index} position="apart">
                    <Code>{uuid}</Code>
                    <CopyButton value={uuid} timeout={2000}>
                      {({ copied, copy }) => (
                        <Button
                          size="xs"
                          variant="subtle"
                          color={copied ? "teal" : "gray"}
                          onClick={copy}
                          leftSection={
                            copied ? (
                              <IconCheck size={14} />
                            ) : (
                              <IconCopy size={14} />
                            )
                          }
                        >
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                ))}
              </Stack>
            ) : (
              <Text color="dimmed" align="center" py="lg">
                Generated UUIDs will appear here
              </Text>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export default UuidGenerator;
