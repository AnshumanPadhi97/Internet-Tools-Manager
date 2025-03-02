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
} from "@mantine/core";
import { IconArrowLeft, IconCopy, IconCheck } from "@tabler/icons-react";

function JsonBeautifier({ onBack }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const beautifyJson = () => {
    try {
      if (!input.trim()) {
        setError("Please enter JSON to beautify");
        setOutput("");
        return;
      }

      const parsedJson = JSON.parse(input);
      const beautified = JSON.stringify(parsedJson, null, 2);
      setOutput(beautified);
      setError("");
    } catch (err) {
      setError("Invalid JSON: " + err.message);
      setOutput("");
    }
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
        <Title order={3}>JSON Beautifier</Title>
      </Group>

      <Group mb="md">
        <Button onClick={beautifyJson}>Beautify JSON</Button>
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
              placeholder="Paste your JSON here..."
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
                {output || "Beautified JSON will appear here"}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </div>
    </Paper>
  );
}

export default JsonBeautifier;
