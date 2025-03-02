import { useState } from "react";
import {
  Button,
  Group,
  Textarea,
  Title,
  Paper,
  Text,
  Alert,
  CopyButton,
  Grid,
  Select,
  Checkbox,
} from "@mantine/core";
import { IconArrowLeft, IconCopy, IconCheck } from "@tabler/icons-react";
import { format } from "sql-formatter";

function SQLFormatter({ onBack }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const [options, setOptions] = useState({
    language: "sql",
    keywordCase: "lower",
    tabWidth: 2,
    useTabs: false,
  });

  const formatSql = () => {
    try {
      if (!input.trim()) {
        setError("Please enter SQL to format");
        setOutput("");
        return;
      }

      const formattedSql = format(input, options);
      setOutput(formattedSql);
      setError("");
    } catch (err) {
      setError("Invalid SQL: " + err.message);
      setOutput("");
    }
  };

  // Handle indentation style change
  const handleIndentStyleChange = (value) => {
    setOptions((prev) => ({
      ...prev,
      useTabs: value === "tabs",
    }));
  };

  // Handle indentation size change
  const handleIndentSizeChange = (value) => {
    setOptions((prev) => ({
      ...prev,
      tabWidth: Number(value),
    }));
  };

  // Handle checkbox options
  const handleCheckboxChange = (name, checked) => {
    setOptions((prev) => ({
      ...prev,
      [name]: checked ? "upper" : "lower",
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
        <Title order={3}>SQL Formatter</Title>
      </Group>

      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      <div>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }} style={{ height: "100%" }}>
            <Text weight={500} mb="xs">
              Input:
            </Text>
            <Textarea
              placeholder="Paste your SQL here..."
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              style={{ height: "calc(100% - 25px)" }}
              h={250}
              styles={{
                wrapper: { height: "100%" },
                input: { height: "100%", resize: "none" },
              }}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }} style={{ height: "100%" }}>
            <Text weight={500} mb="xs">
              Output:
            </Text>
            <Paper
              withBorder
              p="md"
              h={250}
              style={{
                height: "calc(100% - 25px)",
                overflowY: "auto",
                backgroundColor: output ? undefined : "rgba(0, 0, 0, 0.03)",
              }}
            >
              <Text
                component="pre"
                style={{ whiteSpace: "pre-wrap", margin: 0 }}
              >
                {output || "Formatted SQL will appear here"}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </div>

      <Group mt="md">
        <Title order={4}>Formatting Options</Title>
      </Group>

      <Grid mt="xs">
        <Grid.Col span={6}>
          <Select
            label="Indentation Style"
            value={options.useTabs ? "tabs" : "spaces"}
            onChange={handleIndentStyleChange}
            data={[
              { value: "spaces", label: "Spaces" },
              { value: "tabs", label: "Tabs" },
            ]}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            label="Indentation Size"
            value={String(options.tabWidth)}
            onChange={handleIndentSizeChange}
            data={[
              { value: "2", label: "2 spaces" },
              { value: "4", label: "4 spaces" },
              { value: "8", label: "8 spaces" },
            ]}
            disabled={options.useTabs}
          />
        </Grid.Col>
      </Grid>

      <Group mt="md">
        <Checkbox
          label="Uppercase SQL keywords"
          checked={options.uppercase}
          onChange={(e) =>
            handleCheckboxChange("keywordCase", e.currentTarget.checked)
          }
        />
      </Group>

      <Group mt="lg">
        <Button onClick={formatSql}>Format SQL</Button>
        {output && (
          <CopyButton value={output} timeout={2000}>
            {({ copied, copy }) => (
              <Button
                color={copied ? "teal" : "blue"}
                onClick={copy}
                leftSection={
                  copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                }
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CopyButton>
        )}
      </Group>
    </Paper>
  );
}

export default SQLFormatter;
