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
  Tabs,
} from "@mantine/core";
import { IconArrowLeft, IconCopy, IconCheck } from "@tabler/icons-react";

function Base64Tool({ onBack }) {
  // Encoder state
  const [encodeInput, setEncodeInput] = useState("");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [encodeError, setEncodeError] = useState("");

  // Decoder state
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeOutput, setDecodeOutput] = useState("");
  const [decodeError, setDecodeError] = useState("");

  const encodeToBase64 = () => {
    try {
      if (!encodeInput.trim()) {
        setEncodeError("Please enter text to encode");
        setEncodeOutput("");
        return;
      }

      const encoded = btoa(encodeInput);
      setEncodeOutput(encoded);
      setEncodeError("");
    } catch (err) {
      setEncodeError("Encoding error: " + err.message);
      setEncodeOutput("");
    }
  };

  const decodeFromBase64 = () => {
    try {
      if (!decodeInput.trim()) {
        setDecodeError("Please enter Base64 to decode");
        setDecodeOutput("");
        return;
      }

      const decoded = atob(decodeInput);
      setDecodeOutput(decoded);
      setDecodeError("");
    } catch (err) {
      setDecodeError("Invalid Base64: " + err.message);
      setDecodeOutput("");
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
        <Title order={3}>Base64 Encoder/Decoder</Title>
      </Group>

      <Tabs defaultValue="encode">
        <Tabs.List>
          <Tabs.Tab value="encode">Encode</Tabs.Tab>
          <Tabs.Tab value="decode">Decode</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="encode" pt="md">
          {encodeError && (
            <Alert color="red" mb="md">
              {encodeError}
            </Alert>
          )}

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text weight={500} mb="xs">
                Input:
              </Text>
              <Textarea
                placeholder="Enter text to encode to Base64..."
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.currentTarget.value)}
                style={{ height: "calc(100% - 25px)" }}
                h={250}
                styles={{
                  wrapper: { height: "100%" },
                  input: { height: "100%", resize: "none" },
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
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
                  backgroundColor: encodeOutput
                    ? undefined
                    : "rgba(0, 0, 0, 0.03)",
                }}
              >
                <Text
                  component="pre"
                  style={{ whiteSpace: "pre-wrap", margin: 0 }}
                >
                  {encodeOutput || "Base64 encoded result will appear here"}
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>

          <Group mt="lg">
            <Button onClick={encodeToBase64}>Encode to Base64</Button>
            {encodeOutput && (
              <CopyButton value={encodeOutput} timeout={2000}>
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
        </Tabs.Panel>

        <Tabs.Panel value="decode" pt="md">
          {decodeError && (
            <Alert color="red" mb="md">
              {decodeError}
            </Alert>
          )}

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text weight={500} mb="xs">
                Input:
              </Text>
              <Textarea
                placeholder="Paste Base64 text to decode..."
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.currentTarget.value)}
                style={{ height: "calc(100% - 25px)" }}
                h={250}
                styles={{
                  wrapper: { height: "100%" },
                  input: { height: "100%", resize: "none" },
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
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
                  backgroundColor: decodeOutput
                    ? undefined
                    : "rgba(0, 0, 0, 0.03)",
                }}
              >
                <Text
                  component="pre"
                  style={{ whiteSpace: "pre-wrap", margin: 0 }}
                >
                  {decodeOutput || "Decoded result will appear here"}
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>

          <Group mt="lg">
            <Button onClick={decodeFromBase64}>Decode from Base64</Button>
            {decodeOutput && (
              <CopyButton value={decodeOutput} timeout={2000}>
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
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}

export default Base64Tool;
