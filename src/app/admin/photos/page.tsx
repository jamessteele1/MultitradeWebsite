import fs from "fs";
import path from "path";

export default function PhotoBrowser() {
  const dir = path.join(process.cwd(), "public/images/buildings-web");
  let photos: string[] = [];
  try {
    photos = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
      .sort();
  } catch (e) {
    // directory may not exist
  }

  return (
    <div style={{ fontFamily: "Outfit, sans-serif", padding: "2rem", background: "#111" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ color: "#D4A843", fontSize: "1.5rem", fontWeight: 800 }}>
          Multitrade Photo Browser — {photos.length} images
        </h1>
        <p style={{ color: "#666", fontSize: "0.875rem", marginBottom: "2rem" }}>
          These are your building photos extracted from the Wix site. Hover for filename.
          Use these to map photos to products in the CMS.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {photos.map((photo) => (
            <div
              key={photo}
              style={{
                position: "relative",
                borderRadius: "0.5rem",
                overflow: "hidden",
                aspectRatio: "3/2",
                background: "#1a1a1a",
              }}
            >
              <img
                src={`/images/buildings-web/${photo}`}
                alt={photo}
                title={photo}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "0.5rem",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  color: "#aaa",
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                }}
              >
                {photo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
