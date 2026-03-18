import LogoAnimation from "@/components/AnimationLogo";
import LoginButton from "@/components/LoginButton";
import SubTitleAnimation from "@/components/AnimationSubTitle";

export default function Home() {
  console.log('URL 확인:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="text-center space-y-8">
        <LogoAnimation />
        <SubTitleAnimation />
        
        <div className="mt-10">
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
