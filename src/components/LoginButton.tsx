'use client';

import { supabase } from '@/lib/supabase';

export default function LoginButton() {
  const handleKakaoLogin = async () => {
    const { error } = await supabase!.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error('카카오 로그인 에러:', error.message);
      alert('로그인 중 에러가 발생했습니다.');
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="flex items-center justify-center w-full max-w-xs py-3 px-4 bg-[#FEE500] text-[#191919] font-bold rounded-lg hover:bg-[#FADA0A] transition-colors gap-2 mx-auto"
    >
      카카오로 시작하기
    </button>
  );
}