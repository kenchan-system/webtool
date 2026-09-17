<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 引き継ぎメモ（開発ツール変更時に必ず読むこと）

Claude Codeでの開発から引き継ぐ場合の、最低限守ってほしいことをまとめておく。
ここに書いていない細かい経緯はgitのコミットメッセージ（すべて日本語で「なぜ変えたか」を書いてある）を参照。

## サイトについて
「システムのケンちゃん」は、個人運営の無料Webツール集（BMI計算・消費税計算・カレンダーなど）。
広告（Google AdSense、未着手）での収益化を前提としたSEO重視サイト。信頼感を出すため、
キャラクター「ケンちゃん」の語り口・イラストを全ページで統一している。

## 技術的な決め事
- デザイントークンは`src/app/globals.css`の`:root`に集約（色・余白・角丸など）。新しい色を
  直書きせず、既存の`var(--xxx)`を再利用する。
- 見出しは`--font-display`（Webフォント：Zen Maru Gothic）、本文は`--font-body`
  （OS標準フォント）。本文をWebフォントに戻さないこと（日本語Webフォントは1ページ
  150件超のリクエストが発生した実績があり、意図的にOS標準へ変更した）。
- 同じロジック・同じJSON-LDの形が3ファイル以上に重複したら、`src/lib/`配下に共通化する
  （`src/lib/seo.ts`の`breadcrumbJsonLd()`が実例。重複コピーが原因でSearch Consoleの
  構造化データエラーを12ページ分同時に踏んだことがある）。
- `NEXT_PUBLIC_SITE_URL`（`src/lib/siteConfig.ts`）はビルド時に静的に焼き込まれる。
  Vercelの環境変数を変更しても、**再デプロイしないと反映されない**。

## 開発フロー（品質基準）
- コードを変更したら、必ず`npm run build`を通してから、実際にブラウザ（開発サーバーor
  本番相当ビルド）で目視・操作確認する。ビルドが通ることと、見た目が正しいことは別物。
- **新しいUIやレイアウトを触ったら、スマホ幅（375px程度）でも必ず確認する。** 過去に
  「PCでは問題ないがスマホでは崩れる／要素が重なる」という不具合を複数回、後から
  指摘されて気づいている。最初から確認していれば防げたもの。
- アクセシビリティの最低ライン：画像にalt、フォームにlabel、見出しの階層を飛ばさない、
  キーボードでフォーカスした時に見た目で分かる（`outline: none`だけにしない）。
- git運用：コミットは実装側（AI）が、意味のある単位で細かく切って行う。**pushは
  ユーザー本人が行う**（プロジェクトオーナーの意図的な選択。AIが最終確認なしに本番へ
  反映させないためのレビューゲート）。

## 既知の落とし穴（同じ調査をやり直さないための記録）
- ドメイン（kenchan-system.com）の登録はムームードメインだが、**DNSの権威はConoHa**
  （`ns-a1/a2/a3.conoha.io`）を向いている。DNSレコードを追加・変更する時は、
  ムームードメインの管理画面ではなくConoHaの管理画面で行うこと。
- ConoHa側にはメール用のMX・SPF・DKIMレコードが設定されている（`info@kenchan-system.com`
  宛のメールに使用）。DNS変更時にこれらを絶対に消さないこと。
- Web3Forms（お問い合わせフォームの送信先）は無料プランではドメイン制限が効かない
  （Pro限定機能）。アクセスキーがどのドメインからでも使える状態は無料プランの仕様。

## コミュニケーションのスタイル
- 完成度や品質を聞かれたら、誇張せず辛口に答える（このプロジェクトのオーナーの希望）。
- 大きな設計判断（アーキテクチャ変更、デザインの見た目が変わる変更など）は、実装前に
  必ず選択肢と根拠を提示してユーザーの判断を仰ぐ。無断で進めない。
