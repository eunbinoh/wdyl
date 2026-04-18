"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Ticket, Category, Item, Phase } from "@/types";

export function useSurvey(ticket: Ticket) {
  const isExpired = ticket.status === "complete" || ticket.status === "cancelled";

  const [phase, setPhase] = useState<Phase>(isExpired ? "expired" : "intro");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [wcItems, setWcItems] = useState<Item[]>([]);
  const [wcRound, setWcRound] = useState(0);
  const [wcWinners, setWcWinners] = useState<Item[]>([]);
  const [step3Items, setStep3Items] = useState<Item[]>([]);
  const [medals, setMedals] = useState<(Item | null)[]>([null, null, null]);
  const [step3Done, setStep3Done] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wcStackLayout, setWcStackLayout] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const sync = () => setWcStackLayout(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (wcRound >= 3) return;
    const nextBase = (wcRound + 1) * 2;
    [wcItems[nextBase], wcItems[nextBase + 1]].forEach((item) => {
      if (!item) return;
      const img = new window.Image();
      img.src = `/items_img/${item.item_id.replace(/_/g, "")}.jpg`;
    });
  }, [wcRound, wcItems]);

  const handleStart = async () => {
    if (ticket.status === "init") {
      await supabase!.from("Ticket").update({ status: "progress" }).eq("ticket_id", ticket.ticket_id);
    }
    setPhase("step1");
  };

  const handleCategoryNext = async () => {
    if (!selectedCategory) return;
    const { data } = await supabase!
      .from("Item")
      .select("item_id, item_name, category_code")
      .eq("category_code", selectedCategory)
      .eq("level", 2)
      .order("item_id", { ascending: true });
    if (!data || data.length < 6) return alert("아이템 데이터를 불러오지 못했어요.");
    setWcItems(data);
    setWcRound(0);
    setWcWinners([]);
    setPhase("step2");
  };

  const getCurrentPair = (): [Item, Item] | null => {
    if (wcRound < 3) {
      const base = wcRound * 2;
      return [wcItems[base], wcItems[base + 1]];
    }
    return null;
  };

  const handleWcPick = async (picked: Item) => {
    if (wcRound < 3) {
      setWcWinners([...wcWinners, picked]);
      setWcRound(wcRound + 1);
      return;
    }
    const { data } = await supabase!
      .from("Item")
      .select("item_id, item_name, category_code")
      .eq("category_code", picked.category_code)
      .eq("level", 3)
      .like("item_id", `${picked.item_id}%`);
    if (!data || data.length < 3) return alert("상세 아이템을 불러오지 못했어요.");
    setStep3Items(data.slice(0, 3));
    setMedals([null, null, null]);
    setStep3Done(false);
    setPhase("step3");
  };

  const handleMedalPick = (item: Item, rank: number) => {
    const newMedals = [...medals];
    const prevIdx = newMedals.findIndex((m) => m?.item_id === item.item_id);
    if (prevIdx !== -1) newMedals[prevIdx] = null;
    newMedals[rank] = item;
    setMedals(newMedals);
    if (newMedals.every((m) => m !== null)) setStep3Done(true);
  };

  const handleSubmitResult = async () => {
    if (!step3Done) return;
    setLoading(true);
    const result = medals.map((m) => m?.item_id).join(" / ");
    const { error } = await supabase!
      .from("Ticket")
      .update({ status: "complete", result })
      .eq("ticket_id", ticket.ticket_id);
    if (error) {
      alert("저장 중 오류가 발생했어요.");
      setLoading(false);
      return;
    }
    setPhase("result");
    setLoading(false);
  };

  return {
    phase,
    setPhase,
    selectedCategory,
    setSelectedCategory,
    wcItems,
    wcRound,
    wcWinners,
    step3Items,
    medals,
    setMedals,
    step3Done,
    setStep3Done,
    loading,
    wcStackLayout,
    handleStart,
    handleCategoryNext,
    getCurrentPair,
    handleWcPick,
    handleMedalPick,
    handleSubmitResult,
  };
}
