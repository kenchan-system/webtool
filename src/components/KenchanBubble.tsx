import { KenchanAvatar, type KenchanMood } from "./KenchanAvatar";

/** 各ツールページの「ケンちゃんのひとこと」吹き出し（.kc/.kc-bubble）。 */
export function KenchanBubble({
  mood = "default",
  size = 56,
  children,
  className,
}: {
  mood?: KenchanMood;
  size?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"kc" + (className ? " " + className : "")}>
      <span className="kc-avatar" aria-hidden="true">
        <KenchanAvatar mood={mood} size={size} />
      </span>
      <span className="kc-bubble">
        <span className="kc-name">ケンちゃんのひとこと</span>
        <span className="kc-text">{children}</span>
      </span>
    </div>
  );
}

/** 結果パネル内などで使う、吹き出しなしの行形式（.result-row）。 */
export function KenchanRow({
  mood = "default",
  size = 44,
  children,
}: {
  mood?: KenchanMood;
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="result-row">
      <span className="kc-avatar" aria-hidden="true">
        <KenchanAvatar mood={mood} size={size} />
      </span>
      <div className="kc-body">{children}</div>
    </div>
  );
}
