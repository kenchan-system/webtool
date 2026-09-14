// サイト全体の設定値。ドメイン確定前の暫定値はここに集約しておき、
// 本番ドメインが決まったら SITE_URL だけ差し替えれば良いようにする。

// TODO: 独自ドメイン取得後、NEXT_PUBLIC_SITE_URL（Vercelの環境変数）に本番URLを設定する。
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kenchan-system.example.com";

export const SITE_NAME = "システムのケンちゃん";

export const GA_MEASUREMENT_ID = "G-7K3LMDCPTY";

// Web3Formsのアクセスキー。サーバー側の秘密鍵ではなく、クライアントから送信する
// 公開用のキー（無料プランではドメイン制限も無いため、そのままハードコードで問題ない）。
export const WEB3FORMS_ACCESS_KEY = "c57a734d-6f66-49e1-b263-147c08eae153";
