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
  Slider,
  SegmentedControl,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCopy,
  IconCheck,
  IconRefresh,
  IconShield,
} from "@tabler/icons-react";

function PasswordGenerator({ onBack }) {
  const [passwords, setPasswords] = useState([]);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("Medium");

  const [options, setOptions] = useState({
    length: 12,
    quantity: 5,
    format: "default",
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });

  const generateRandomChar = (charSet) => {
    return charSet.charAt(Math.floor(Math.random() * charSet.length));
  };

  const generatePassword = (length, opts) => {
    let charset = "";
    let password = "";

    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Remove similar characters if option is selected
    const similarChars = "iIlL1oO0";
    const ambiguousChars = "{}[]()/\\'\"`~,;:.<>";

    let upperset = opts.excludeSimilar
      ? uppercaseChars
          .split("")
          .filter((c) => !similarChars.includes(c))
          .join("")
      : uppercaseChars;

    let lowerset = opts.excludeSimilar
      ? lowercaseChars
          .split("")
          .filter((c) => !similarChars.includes(c))
          .join("")
      : lowercaseChars;

    let numberset = opts.excludeSimilar
      ? numberChars
          .split("")
          .filter((c) => !similarChars.includes(c))
          .join("")
      : numberChars;

    let symbolset = opts.excludeAmbiguous
      ? symbolChars
          .split("")
          .filter((c) => !ambiguousChars.includes(c))
          .join("")
      : symbolChars;

    if (opts.uppercase) charset += upperset;
    if (opts.lowercase) charset += lowerset;
    if (opts.numbers) charset += numberset;
    if (opts.symbols) charset += symbolset;

    if (charset === "") {
      throw new Error("Please select at least one character type.");
    }

    // Ensure at least one character from each selected type
    if (opts.uppercase) password += generateRandomChar(upperset);
    if (opts.lowercase) password += generateRandomChar(lowerset);
    if (opts.numbers) password += generateRandomChar(numberset);
    if (opts.symbols) password += generateRandomChar(symbolset);

    // Fill the rest of the password
    for (let i = password.length; i < length; i++) {
      password += generateRandomChar(charset);
    }

    // Shuffle the password
    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    return password;
  };

  const calculateStrength = (password) => {
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    const varietyScore = [
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
    ].filter(Boolean).length;

    if (length < 8 || varietyScore < 2) return "Weak";
    if (length < 12 || varietyScore < 3) return "Medium";
    if (length < 16 || varietyScore < 4) return "Strong";
    return "Very Strong";
  };

  const generatePasswords = () => {
    try {
      const quantity = Math.min(100, Math.max(1, options.quantity));
      const newPasswords = [];
      let strength = "Medium";

      for (let i = 0; i < quantity; i++) {
        let password = generatePassword(options.length, options);

        if (i === 0) {
          strength = calculateStrength(password);
        }

        if (options.format === "dashes") {
          // Insert a dash every 4 characters
          password = password.match(/.{1,4}/g).join("-");
        } else if (options.format === "spaces") {
          // Insert a space every 4 characters
          password = password.match(/.{1,4}/g).join(" ");
        }

        newPasswords.push(password);
      }

      setPasswords(newPasswords);
      setPasswordStrength(strength);
      setError("");
    } catch (err) {
      setError("Error generating passwords: " + err.message);
      setPasswords([]);
    }
  };

  const handleOptionChange = (name, value) => {
    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case "Weak":
        return "red";
      case "Medium":
        return "yellow";
      case "Strong":
        return "green";
      case "Very Strong":
        return "teal";
      default:
        return "gray";
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
        <Title order={3}>Random Password Generator</Title>
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

              <NumberInput
                label="Password Length"
                description="Number of characters (8-64)"
                value={options.length}
                onChange={(value) => handleOptionChange("length", value)}
                min={8}
                max={64}
              />

              <NumberInput
                label="Quantity"
                description="Number of passwords to generate (1-100)"
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
                  { value: "default", label: "No Separator" },
                  {
                    value: "dashes",
                    label: "With Dashes (Every 4 Characters)",
                  },
                  {
                    value: "spaces",
                    label: "With Spaces (Every 4 Characters)",
                  },
                ]}
              />

              <Title order={5}>Character Types</Title>
              <Group>
                <Checkbox
                  label="Uppercase (A-Z)"
                  checked={options.uppercase}
                  onChange={(e) =>
                    handleOptionChange("uppercase", e.currentTarget.checked)
                  }
                />

                <Checkbox
                  label="Lowercase (a-z)"
                  checked={options.lowercase}
                  onChange={(e) =>
                    handleOptionChange("lowercase", e.currentTarget.checked)
                  }
                />
              </Group>

              <Group>
                <Checkbox
                  label="Numbers (0-9)"
                  checked={options.numbers}
                  onChange={(e) =>
                    handleOptionChange("numbers", e.currentTarget.checked)
                  }
                />

                <Checkbox
                  label="Symbols (!@#$%...)"
                  checked={options.symbols}
                  onChange={(e) =>
                    handleOptionChange("symbols", e.currentTarget.checked)
                  }
                />
              </Group>

              <Title order={5}>Exclude Characters</Title>
              <Group>
                <Checkbox
                  label="Similar (i, I, l, L, 1, o, O, 0)"
                  checked={options.excludeSimilar}
                  onChange={(e) =>
                    handleOptionChange(
                      "excludeSimilar",
                      e.currentTarget.checked
                    )
                  }
                />
              </Group>
              <Group>
                <Checkbox
                  label="Ambiguous ({ } [ ] ( ) / \\ ~ , ; : . < >)"
                  checked={options.excludeAmbiguous}
                  onChange={(e) =>
                    handleOptionChange(
                      "excludeAmbiguous",
                      e.currentTarget.checked
                    )
                  }
                />
              </Group>

              <Group>
                <Button
                  onClick={generatePasswords}
                  leftSection={<IconRefresh size={16} />}
                >
                  Generate Passwords
                </Button>

                {passwords.length > 0 && (
                  <CopyButton value={passwords.join("\n")} timeout={2000}>
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
          {passwords.length > 0 && (
            <Alert
              color={getStrengthColor(passwordStrength)}
              mb="md"
              icon={<IconShield size={16} />}
            >
              Password Strength: <strong>{passwordStrength}</strong>
            </Alert>
          )}

          <Text weight={500} mb="xs">
            Generated Passwords:
          </Text>
          <Paper
            withBorder
            p="md"
            h={380}
            style={{
              overflowY: "auto",
              backgroundColor: passwords.length
                ? undefined
                : "rgba(0, 0, 0, 0.03)",
            }}
          >
            {passwords.length > 0 ? (
              <Stack spacing="xs">
                {passwords.map((password, index) => (
                  <Group key={index} position="apart">
                    <Code>{password}</Code>
                    <CopyButton value={password} timeout={2000}>
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
                Generated passwords will appear here
              </Text>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export default PasswordGenerator;
