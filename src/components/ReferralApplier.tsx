"use client";

import { useEffect } from "react";

type Props = {
  userId: string;
};

export default function ReferralApplier({ userId }: Props) {
  useEffect(() => {
    const refId = localStorage.getItem("wdyl_ref_id");
    if (!refId || !userId || refId === userId) {
      if (refId === userId) localStorage.removeItem("wdyl_ref_id");
      return;
    }

    const apply = async () => {
      const res = await fetch("/api/referral/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, refId }),
      });
      const result = await res.json().catch(() => null);

      if (res.ok || result?.message === "ALREADY_APPLIED") {
        localStorage.removeItem("wdyl_ref_id");
      } else {
        console.error("[ReferralApplier] apply error:", result);
      }
    };

    apply();
  }, [userId]);

  return null;
}
