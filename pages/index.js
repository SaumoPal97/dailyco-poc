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
      <Script src="https://raw.githubusercontent.com/paulirish/memory-stats.js/master/memory-stats.js" />
      <Script id="show-banner" strategy="lazyOnload">
        {` var stats = new MemoryStats();

          stats.domElement.style.position = 'fixed';
          stats.domElement.style.right        = '0px';
          stats.domElement.style.bottom       = '0px';
        
          document.body.appendChild( stats.domElement );

          requestAnimationFrame(function rAFloop(){
            stats.update();
            requestAnimationFrame(rAFloop);
          });`}
      </Script>
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
