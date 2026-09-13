import Image from "next/image";

export type KenchanMood = "default" | "happy" | "think" | "error";

const FACE_SRC: Record<Exclude<KenchanMood, "error">, string> = {
  default: "/kenchan/face-default.png",
  happy: "/kenchan/face-happy.png",
  think: "/kenchan/face-think.png",
};

/** プロトタイプの avatarImg(mood, size) の移植。
 *  "error" だけ専用の全身イラスト（困り顔）を上寄せでクロップして使う。 */
export function KenchanAvatar({
  mood = "default",
  size,
}: {
  mood?: KenchanMood;
  size: number;
}) {
  const isError = mood === "error";
  const src = isError ? "/kenchan/full-error.png" : FACE_SRC[mood];
  return (
    <Image
      className="kc-face"
      src={src}
      alt=""
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        objectPosition: isError ? "center 4%" : "center 20%",
      }}
    />
  );
}

/** ソフト詳細ページ・404など、全身イラストをそのまま大きく出す場所向け。 */
export function KenchanFull({ height }: { height: number }) {
  // 元PNGは 400×600（縦横比2:3）
  const width = Math.round((height * 400) / 600);
  return (
    <Image
      className="kc-big"
      src="/kenchan/full-error.png"
      alt="ケンちゃん"
      width={width}
      height={height}
      style={{ height, width: "auto" }}
    />
  );
}
