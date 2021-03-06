import { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { Alert, Button, ThemeProvider, TextInput } from "evergreen-ui";
import Call from "../components/Call";
import theme from "../styles/theme";

export default function Home() {
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [error, setError] = useState();
  const [roomUrl, setRoomUrl] = useState();
  const [name, setName] = useState(null);

  async function handleCreateRoom() {
    setCreatingRoom(true);

    console.log(`🚪 Creating new demo room...`);

    const res = await fetch("/api/createRoom", { method: "POST" });

    const { url, error } = await res.json();

    if (url) {
      console.log(`🚪 Room created: ${url}`);
      setRoomUrl(url);
    } else {
      setError(error || "An unknown error occured");
    }

    setCreatingRoom(false);
  }

  return (
    <ThemeProvider value={theme}>
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
    javascript:(function(){var script=document.createElement('script');script.src='https://rawgit.com/paulirish/memory-stats.js/master/bookmarklet.js';document.head.appendChild(script);})()
  `,
        }}
      />
      <Head>
        <title>Daily JS - Pagination Demo</title>
      </Head>

      {!name || !roomUrl ? (
        <main>
          {error && (
            <Alert intent="danger" title="Unable to create new room">
              {error}
            </Alert>
          )}
          <TextInput
            name="text-input-name"
            id="username"
            placeholder="Enter name..."
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <Button
            onClick={() => handleCreateRoom()}
            isLoading={creatingRoom}
            appearance="primary"
            height={48}
          >
            {creatingRoom ? "Creating room..." : "Create and join room"}
          </Button>
        </main>
      ) : (
        <Call roomUrl={roomUrl} name={name} />
      )}
    </ThemeProvider>
  );
}
