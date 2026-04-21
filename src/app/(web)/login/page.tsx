"use client";

import LogoAnimation from "@/components/AnimationLogo";
import SubTitleAnimation from "@/components/AnimationSubTitle";
import LoginKakaoButton from "@/components/LoginKakaoButton";
import LoginGuestButton from "@/components/LoginGuestButton";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="text-center space-y-8">
        <LogoAnimation />
        <SubTitleAnimation />
        <div className="mt-10 flex flex-col gap-2">
          <LoginKakaoButton
            loading={loading}
            setLoading={setLoading}
          />
          <LoginGuestButton
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </div>
    </main>
  );
}
