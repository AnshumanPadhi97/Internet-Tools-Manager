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
  Checkbox,
  Grid,
} from "@mantine/core";
import { IconArrowLeft, IconCopy, IconCheck } from "@tabler/icons-react";
import { minify } from "terser";

function JsMinifier({ onBack }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isMinifying, setIsMinifying] = useState(false);
  const [options, setOptions] = useState({
    compress: true,
    mangle: true,
    format: {
      comments: false,
    },
  });

  const minifyJs = async () => {
    try {
      if (!input.trim()) {
        setError("Please enter JavaScript code to minify");
        setOutput("");
        return;
      }

      setIsMinifying(true);
      setError("");

      // Use Terser for professional minification
      const result = await minify(input, options);

      setOutput(result.code);
      setIsMinifying(false);
    } catch (err) {
      setError("Error minifying JavaScript: " + err.message);
      setOutput("");
      setIsMinifying(false);
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
        <Title order={3}>JavaScript Minifier</Title>
      </Group>

      <Group align="flex-start" mb="md">
        <Checkbox
          label="Compress code"
          checked={options.compress}
          onChange={(event) =>
            setOptions({
              ...options,
              compress: event.currentTarget.checked,
            })
          }
        />

        <Checkbox
          label="Mangle variable names"
          checked={options.mangle}
          onChange={(event) =>
            setOptions({
              ...options,
              mangle: event.currentTarget.checked,
            })
          }
        />

        <Checkbox
          label="Remove comments"
          checked={!options.format.comments}
          onChange={(event) =>
            setOptions({
              ...options,
              format: {
                ...options.format,
                comments: !event.currentTarget.checked,
              },
            })
          }
        />

        <Button onClick={minifyJs} loading={isMinifying}>
          {isMinifying ? "Minifying..." : "Minify JavaScript"}
        </Button>

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
              h={250}
              placeholder="Paste your JavaScript code here..."
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              style={{ height: "calc(100% - 25px)" }}
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
                {output || "Minified JavaScript will appear here"}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </div>

      {output && (
        <Text size="sm" c="dimmed" mt="md">
          Original size: {new Blob([input]).size} bytes | Minified size:{" "}
          {new Blob([output]).size} bytes | Saved:{" "}
          {(
            100 -
            (new Blob([output]).size / new Blob([input]).size) * 100
          ).toFixed(2)}
          %
        </Text>
      )}
    </Paper>
  );
}

export default JsMinifier;
