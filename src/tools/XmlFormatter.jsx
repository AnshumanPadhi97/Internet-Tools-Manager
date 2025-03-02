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
import xmlFormatter from "xml-formatter";

function XmlFormatter({ onBack }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const [options, setOptions] = useState({
    indentation: "  ", // Default to 2 spaces
    collapseContent: false,
    lineSeparator: "\n",
    whiteSpaceAtEndOfSelfclosingTag: true,
  });

  const formatXml = () => {
    try {
      if (!input.trim()) {
        setError("Please enter XML to format");
        setOutput("");
        return;
      }

      const formattedXml = xmlFormatter(input, options);
      setOutput(formattedXml);
      setError("");
    } catch (err) {
      setError("Invalid XML: " + err.message);
      setOutput("");
    }
  };

  // Handle indentation style and size changes
  const handleIndentationChange = (style, size) => {
    const indentation = style === "tabs" ? "\t" : " ".repeat(Number(size));
    setOptions((prev) => ({
      ...prev,
      indentation,
    }));
  };

  // Handle checkbox options
  const handleCheckboxChange = (name, checked) => {
    setOptions((prev) => ({
      ...prev,
      [name]: checked,
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
        <Title order={3}>XML Formatter</Title>
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
              placeholder="Paste your XML here..."
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
                {output || "Formatted XML will appear here"}
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
            defaultValue="spaces"
            onChange={(value) =>
              handleIndentationChange(
                value,
                options.indentation === "\t" ? "2" : options.indentation.length
              )
            }
            data={[
              { value: "spaces", label: "Spaces" },
              { value: "tabs", label: "Tabs" },
            ]}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            label="Indentation Size"
            defaultValue="2"
            onChange={(value) =>
              handleIndentationChange(
                options.indentation === "\t" ? "tabs" : "spaces",
                value
              )
            }
            data={[
              { value: "2", label: "2 spaces" },
              { value: "4", label: "4 spaces" },
              { value: "8", label: "8 spaces" },
            ]}
            disabled={options.indentation === "\t"}
          />
        </Grid.Col>
      </Grid>

      <Group mt="md">
        <Checkbox
          label="Collapse content"
          checked={options.collapseContent}
          onChange={(e) =>
            handleCheckboxChange("collapseContent", e.currentTarget.checked)
          }
        />

        <Checkbox
          label="Add space in self-closing tags"
          checked={options.whiteSpaceAtEndOfSelfclosingTag}
          onChange={(e) =>
            handleCheckboxChange(
              "whiteSpaceAtEndOfSelfclosingTag",
              e.currentTarget.checked
            )
          }
        />
      </Group>

      <Group mt="lg">
        <Button onClick={formatXml}>Format XML</Button>
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

export default XmlFormatter;
