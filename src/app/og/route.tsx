import { readFileSync } from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/siteConfig";

// ツールごとのOGP画像をクエリパラメータ（title/tagline）から動的に生成する。
// 静的な画像ファイルを個別に用意する代わりに、この1本のルートを全ページの
// generateMetadata/metadataからURLクエリ付きで参照する（/og?title=...&tagline=...）。
export const runtime = "nodejs";

let faceDataUri: string | null = null;
function getFaceDataUri(): string {
  if (!faceDataUri) {
    const buf = readFileSync(path.join(process.cwd(), "public", "kenchan", "face-default.png"));
    faceDataUri = `data:image/png;base64,${buf.toString("base64")}`;
  }
  return faceDataUri;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || SITE_NAME;
  const tagline = searchParams.get("tagline") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#f3f0ea",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getFaceDataUri()} width={84} height={84} style={{ borderRadius: "50%" }} alt="" />
          <div style={{ fontSize: 30, fontWeight: 700, color: "#175a9f" }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", fontSize: 62, fontWeight: 700, color: "#1b2430", lineHeight: 1.25 }}>{title}</div>
        {tagline && (
          <div style={{ display: "flex", fontSize: 30, color: "#55606f", marginTop: 28 }}>{tagline}</div>
        )}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
