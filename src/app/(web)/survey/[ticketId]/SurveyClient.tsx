"use client";

import { Ticket, Category } from "@/types";
import { useSurvey } from "./_hooks/useSurvey";
import { getTs, makeStyles } from "./_styles";
import { ExpiredPhase } from "./_phases/ExpiredPhase";
import { IntroPhase } from "./_phases/IntroPhase";
import { Step1Phase } from "./_phases/Step1Phase";
import { Step2Phase } from "./_phases/Step2Phase";
import { Step3Phase } from "./_phases/Step3Phase";
import { ResultPhase } from "./_phases/ResultPhase";
import { PreloadImages } from "@/components/PreloadImages";
import { useEffect } from "react";

type Props = { ticket: Ticket; categories: Category[] };

export default function SurveyClient({ ticket, categories }: Props) {
  const ts = getTs(ticket.theme);
  const s = makeStyles(ts);
  const survey = useSurvey(ticket);

  // 이미지 프리로드 (페이지 진입 즉시)
  useEffect(() => {
    categories.forEach((cat) => {
      const img = new window.Image();
      const src = `/category/${cat.category_code}.webp`;
      img.src = `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`;
    });
  }, [categories]);

  const commonProps = {
    ticket,
    ts,
    pageStyle: s.page,
    cardStyle: s.card,
    accentBtnStyle: s.accentBtn,
    backBtnStyle: s.backBtn,
  };

  if (survey.phase === "expired")
    return (
      <ExpiredPhase
        ts={ts}
        pageStyle={s.page}
      />
    );
  if (survey.phase === "intro")
    return (
      <IntroPhase
        {...commonProps}
        onStart={survey.handleStart}
      />
    );
  if (survey.phase === "step1")
    return (
      <Step1Phase
        {...commonProps}
        categories={categories}
        selectedCategory={survey.selectedCategory}
        onSelect={survey.setSelectedCategory}
        onNext={survey.handleCategoryNext}
      />
    );
  if (survey.phase === "step2")
    return (
      <>
        <Step2Phase
          {...commonProps}
          wcRound={survey.wcRound}
          wcWinners={survey.wcWinners}
          getCurrentPair={survey.getCurrentPair}
          onPick={survey.handleWcPick}
          onBack={() => survey.setPhase("step1")}
        />
        {survey.selectedCategory && survey.wcItems && (
          <PreloadImages itemIds={survey.wcItems.map((item) => item.item_id)} />
        )}
      </>
    );
  if (survey.phase === "step3")
    return (
      <Step3Phase
        {...commonProps}
        step3Items={survey.step3Items}
        medals={survey.medals}
        step3Done={survey.step3Done}
        loading={survey.loading}
        onMedalToggle={(item) => {
          const medalIdx = survey.medals.findIndex((m) => m?.item_id === item.item_id);
          if (medalIdx !== -1) {
            const newMedals = survey.medals.map((m) => (m?.item_id === item.item_id ? null : m));
            survey.setMedals(newMedals);
            survey.setStep3Done(false);
          } else {
            const nextRank = survey.medals.findIndex((m) => m === null);
            if (nextRank !== -1) survey.handleMedalPick(item, nextRank);
          }
        }}
        onSubmit={survey.handleSubmitResult}
        onBack={() => survey.setPhase("step1")}
      />
    );
  if (survey.phase === "result")
    return (
      <ResultPhase
        {...commonProps}
        medals={survey.medals}
      />
    );

  return null;
}
