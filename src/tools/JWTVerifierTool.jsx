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
  TextInput,
  Code,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCopy,
  IconCheck,
  IconSearch,
} from "@tabler/icons-react";

function JWTVerifierTool({ onBack }) {
  // JWT verification state
  const [jwtInput, setJwtInput] = useState("");
  const [jwtParts, setJwtParts] = useState(null);
  const [jwtError, setJwtError] = useState("");

  // Signature verification
  const [secretKey, setSecretKey] = useState("");
  const [signatureStatus, setSignatureStatus] = useState(null);

  // Helper function to base64url encode/decode
  const base64UrlDecode = (input) => {
    // Replace non-url compatible chars with base64 standard chars
    input = input.replace(/-/g, "+").replace(/_/g, "/");

    // Pad with standard base64 required padding characters
    const pad = input.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error("Invalid base64url string");
      }
      input += new Array(5 - pad).join("=");
    }

    return atob(input);
  };

  const base64UrlEncode = (str) => {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };

  // Function to convert string to ArrayBuffer
  const stringToArrayBuffer = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  const parseJWT = () => {
    try {
      if (!jwtInput.trim()) {
        setJwtError("Please enter a JWT token");
        setJwtParts(null);
        setSignatureStatus(null);
        return;
      }

      // Split the JWT into its parts
      const parts = jwtInput.split(".");

      if (parts.length !== 3) {
        setJwtError(
          "Invalid JWT format. Expected format: header.payload.signature"
        );
        setJwtParts(null);
        setSignatureStatus(null);
        return;
      }

      // Decode header and payload
      let header;
      try {
        header = JSON.parse(base64UrlDecode(parts[0]));
      } catch (err) {
        setJwtError("Error decoding header: " + err.message);
        setJwtParts(null);
        setSignatureStatus(null);
        return;
      }

      let payload;
      try {
        payload = JSON.parse(base64UrlDecode(parts[1]));
      } catch (err) {
        setJwtError("Error decoding payload: " + err.message);
        setJwtParts(null);
        setSignatureStatus(null);
        return;
      }

      // Check for token expiration
      let isExpired = false;
      if (payload.exp) {
        const expiryDate = new Date(payload.exp * 1000);
        const currentDate = new Date();
        isExpired = currentDate > expiryDate;
      }

      // Format dates in payload if they exist
      if (payload.exp) {
        payload.exp_formatted = new Date(payload.exp * 1000).toLocaleString();
      }
      if (payload.iat) {
        payload.iat_formatted = new Date(payload.iat * 1000).toLocaleString();
      }
      if (payload.nbf) {
        payload.nbf_formatted = new Date(payload.nbf * 1000).toLocaleString();
      }

      setJwtParts({
        header: header,
        payload: payload,
        signature: parts[2],
        isExpired: isExpired,
        headerRaw: parts[0],
        payloadRaw: parts[1],
        signatureRaw: parts[2],
      });

      setJwtError("");
      setSignatureStatus(null);
    } catch (err) {
      setJwtError("Error parsing JWT: " + err.message);
      setJwtParts(null);
      setSignatureStatus(null);
    }
  };

  const verifySignature = async () => {
    if (!jwtParts) {
      setSignatureStatus({
        valid: false,
        message: "Please decode a JWT token first",
      });
      return;
    }

    if (!secretKey.trim()) {
      setSignatureStatus({
        valid: false,
        message: "Please enter a secret key to verify the signature",
      });
      return;
    }

    try {
      const { header, headerRaw, payloadRaw, signatureRaw } = jwtParts;
      const algorithm = header.alg;

      if (algorithm !== "HS256") {
        setSignatureStatus({
          valid: false,
          message: `This tool currently only supports HS256 algorithm verification. The token uses ${algorithm}.`,
        });
        return;
      }

      // For HS256, we'll use the Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(`${headerRaw}.${payloadRaw}`);
      const keyData = encoder.encode(secretKey);
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await window.crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        data
      );

      // Convert the ArrayBuffer to Base64Url
      const signatureBytes = new Uint8Array(signature);
      let binarySignature = "";
      for (let i = 0; i < signatureBytes.byteLength; i++) {
        binarySignature += String.fromCharCode(signatureBytes[i]);
      }
      const calculatedSignature = base64UrlEncode(binarySignature);

      const isValid = calculatedSignature === signatureRaw;

      setSignatureStatus({
        valid: isValid,
        message: isValid
          ? "✅ Signature is valid!"
          : "❌ Signature verification failed. The signature does not match.",
      });
    } catch (error) {
      setSignatureStatus({
        valid: false,
        message: "Error verifying signature: " + error.message,
      });
    }
  };

  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
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
        <Title order={3}>JWT Verifier</Title>
      </Group>

      <Text mb="md">
        Paste a JWT token to decode its header and payload. You can also verify
        the signature with a secret key for HS256-signed tokens.
      </Text>

      {jwtError && (
        <Alert color="red" mb="md">
          {jwtError}
        </Alert>
      )}

      <Textarea
        placeholder="Paste your JWT token here (header.payload.signature)..."
        value={jwtInput}
        onChange={(e) => setJwtInput(e.currentTarget.value)}
        minRows={3}
        mb="md"
      />

      <Group mb="xl">
        <Button onClick={parseJWT} leftSection={<IconSearch size={16} />}>
          Decode JWT
        </Button>
      </Group>

      {jwtParts && (
        <>
          <Tabs defaultValue="header">
            <Tabs.List>
              <Tabs.Tab value="header">Header</Tabs.Tab>
              <Tabs.Tab value="payload">Payload</Tabs.Tab>
              <Tabs.Tab value="signature">Signature</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="header" pt="md">
              <Text weight={500} mb="xs">
                Decoded Header:
              </Text>
              <Paper
                withBorder
                p="md"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <Code block>{formatJSON(jwtParts.header)}</Code>
              </Paper>
              <Group mt="md">
                <CopyButton value={formatJSON(jwtParts.header)} timeout={2000}>
                  {({ copied, copy }) => (
                    <Button
                      size="sm"
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
                      {copied ? "Copied" : "Copy Header"}
                    </Button>
                  )}
                </CopyButton>
                <CopyButton value={jwtParts.headerRaw} timeout={2000}>
                  {({ copied, copy }) => (
                    <Button
                      size="sm"
                      variant="outline"
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
                      {copied ? "Copied" : "Copy Raw Header"}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Tabs.Panel>

            <Tabs.Panel value="payload" pt="md">
              <Text weight={500} mb="xs">
                Decoded Payload:
              </Text>
              {jwtParts.isExpired && (
                <Alert color="yellow" mb="md">
                  ⚠️ This token has expired.
                </Alert>
              )}
              <Paper
                withBorder
                p="md"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <Code block>{formatJSON(jwtParts.payload)}</Code>
              </Paper>
              <Group mt="md">
                <CopyButton value={formatJSON(jwtParts.payload)} timeout={2000}>
                  {({ copied, copy }) => (
                    <Button
                      size="sm"
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
                      {copied ? "Copied" : "Copy Payload"}
                    </Button>
                  )}
                </CopyButton>
                <CopyButton value={jwtParts.payloadRaw} timeout={2000}>
                  {({ copied, copy }) => (
                    <Button
                      size="sm"
                      variant="outline"
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
                      {copied ? "Copied" : "Copy Raw Payload"}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Tabs.Panel>

            <Tabs.Panel value="signature" pt="md">
              <Text weight={500} mb="md">
                Verify Signature:
              </Text>
              {jwtParts.header && jwtParts.header.alg !== "HS256" && (
                <Alert color="blue" mb="md">
                  This tool currently only supports verification for HS256
                  algorithm. The token uses {jwtParts.header.alg}.
                </Alert>
              )}
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Secret Key"
                    placeholder="Enter your secret key..."
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.currentTarget.value)}
                    mb="md"
                  />
                  <Button onClick={verifySignature} mb="md">
                    Verify Signature
                  </Button>

                  {signatureStatus && (
                    <Alert
                      color={signatureStatus.valid ? "green" : "red"}
                      mb="md"
                    >
                      {signatureStatus.message}
                    </Alert>
                  )}
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text weight={500} mb="xs">
                    Signature (Base64Url encoded):
                  </Text>
                  <Paper
                    withBorder
                    p="md"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.03)",
                      overflowWrap: "break-word",
                    }}
                  >
                    <Text>{jwtParts.signatureRaw}</Text>
                  </Paper>
                  <Group mt="md">
                    <CopyButton value={jwtParts.signatureRaw} timeout={2000}>
                      {({ copied, copy }) => (
                        <Button
                          size="sm"
                          variant="outline"
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
                          {copied ? "Copied" : "Copy Signature"}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </Paper>
  );
}

export default JWTVerifierTool;
