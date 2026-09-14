import Link from "next/link";
import { KenchanFull } from "@/components/KenchanAvatar";

export default function NotFound() {
  return (
    <div className="screen" style={{ textAlign: "center", paddingBlock: 40 }}>
      <KenchanFull height={220} />
      <h1 style={{ marginTop: 24 }}>お探しのページが見つかりません</h1>
      <p className="lede">
        URLが変更・削除されたか、入力に誤りがあるようです。トップページから目的のツールを探してみてください。
      </p>
      <p style={{ marginTop: 24 }}>
        <Link className="chip" href="/">トップページへ戻る</Link>
      </p>
    </div>
  );
}
