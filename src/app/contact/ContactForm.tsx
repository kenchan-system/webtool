"use client";

import { useState } from "react";
import { SITE_NAME, WEB3FORMS_ACCESS_KEY } from "@/lib/siteConfig";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const form = e.currentTarget;
    // ハニーポット：botcheckは通常のユーザーには見えない欄で、
    // ここに値が入っていたら送信せずエラー扱いにする（簡易スパム対策）。
    const botcheck = (form.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked;
    if (botcheck) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `お問い合わせ - ${SITE_NAME}`,
          from_name: SITE_NAME,
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-status contact-status--ok" role="status">
        <p>お問い合わせを受け付けました。内容を確認のうえ、順次対応いたします。</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="contact-name">お名前</label>
        <div className="input">
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="任意"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-email">メールアドレス</label>
        <div className="input">
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-message">お問い合わせ内容</label>
        <div className="input">
          <textarea
            id="contact-message"
            required
            rows={4}
            placeholder="不具合の内容、ご意見・ご要望などをご記入ください。"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
      <input type="checkbox" name="botcheck" className="sr-only" tabIndex={-1} autoComplete="off" />

      {status === "error" && (
        <p className="contact-status contact-status--error" role="alert">
          送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、
          <a href="mailto:info@kenchan-system.com">info@kenchan-system.com</a>までご連絡ください。
        </p>
      )}

      <button type="submit" className="contact-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}
