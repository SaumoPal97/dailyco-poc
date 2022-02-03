export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name } = req.body;
    console.log(`Creating token on domain ${process.env.DAILY_DOMAIN} ${name}`);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          room_name: "poc-saumo",
          user_name: name,
          start_video_off: parseInt(name) > 2,
          start_audio_off: parseInt(name) > 2,
        },
      }),
    };

    const dailyRes = await fetch(
      "https://api.daily.co/v1/meeting-tokens",
      options
    );

    const { token } = await dailyRes.json();

    if (!token) {
      return res.status(500).json({ error: "no token" });
    }

    return res.status(200).json({
      token,
    });
  }

  return res.status(500);
}
