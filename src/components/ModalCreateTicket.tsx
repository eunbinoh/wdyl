'use client'

import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import { ChevronLeft, ChevronRight, CircleHelp } from 'lucide-react'

type Theme = 'formal' | 'friend' | 'sweet'

const THEMES: { value: Theme; label: string; emoji: string }[] = [
  { value: 'formal', label: '정중', emoji: '🎩' },
  { value: 'friend', label: '친근', emoji: '🤝🏻' },
  { value: 'sweet',  label: '스윗', emoji: '💕' },
]

const THEME_STYLE: Record<Theme, {
  bg: string; accent: string; text: string
  subText: string; cardBg: string; font: string
}> = {
  formal: { bg: '#1C1C1C', accent: '#FFFFFF', text: '#FFFFFF', subText: '#888', cardBg: '#2A2A2A', font: 'Georgia, serif' },
  friend: { bg: '#EDE9F8', accent: '#7C5CBF', text: '#2D1F5E', subText: '#9B8EC4', cardBg: '#FFFFFF', font: 'inherit' },
  sweet:  { bg: '#FFF0F5', accent: '#E8639A', text: '#8B2252', subText: '#D4879E', cardBg: '#FFFFFF', font: 'inherit' },
}

const TRAIT_SUFFIX: Record<Theme, string[]> = {
  formal: ['으시며', '시고', '신'],
  friend: ['하고', '하며', '한'],
  sweet:  ['하고', '하며', '한'],
}

const TOOLTIPS: Record<string, string> = {
  CONCEPT: '링크를 받는 친구에게 보여질 말투와 분위기예요.',
  TO: '선물 받을 친구 이름. 설문 첫 화면 타이틀에 사용돼요.',
  'ABOUT WHO': '친구 특징 3가지. 결과 화면에 자동 삽입됩니다.',
}

type Props = {
  userId: string
  credits: number
  onClose: () => void
  onSuccess: () => void
}

export default function CreateTicketModal({ userId, credits, onClose, onSuccess }: Props) {
  const [theme, setTheme] = useState<Theme>('formal')
  const [toName, setToName] = useState('')
  const [traits, setTraits] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)
  const [tooltip, setTooltip] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewPage, setPreviewPage] = useState(0)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const setTrait = (i: number, v: string) =>
    setTraits(prev => prev.map((t, idx) => idx === i ? v : t))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node))
        setTooltip(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = async () => {
    if (!toName.trim()) return alert('받는 사람 이름을 입력해주세요.')
    if (traits.some(t => !t.trim())) return alert('특징 3가지를 모두 입력해주세요.')
    if (credits < 1) return alert('크레딧이 부족해요. 충전 후 이용해주세요.')
    setLoading(true)
    try {
      const ticketId = nanoid(8)
      const { error: e1 } = await supabase!.from('Ticket').insert({
        id: ticketId, user_id: userId, theme,
        to_name: toName.trim(),
        adjectives: traits.map(t => t.trim()),
        status: 'init',
      })
      if (e1) throw e1
      const { error: e2 } = await supabase!.from('User')
        .update({ credits: credits - 1 }).eq('id', userId)
      if (e2) throw e2
      onSuccess()
    } catch (e) {
      console.error(e)
      alert('티켓 생성 중 오류가 발생했어요.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    flex: 1, border: 'none',
    backgroundColor: '#ffffff',
    color: '#1C1C1C',
    WebkitTextFillColor: '#1C1C1C',
    fontSize: 16, outline: 'none', fontFamily: 'inherit',
  } as React.CSSProperties

  const sectionLabel = (key: string) => (
    <div style={{ fontSize: 14, fontWeight: 700, color: '#AAA', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', position: 'relative' }}>
      <span style={{ flex: 1 }}>{key}</span>
      <span
        onClick={(e) => { e.stopPropagation(); setTooltip(prev => prev === key ? null : key) }}
        style={{ cursor: 'pointer' }}
      ><CircleHelp size={18} color="#1C1C1C" /></span>
      {tooltip === key && (
        <div style={{ position: 'absolute', top: -7, right: 24, background: '#000', color: '#fff', fontSize: 14, padding: '6px 12px', borderRadius: 8, zIndex: 20, whiteSpace: 'nowrap', fontWeight: 400, letterSpacing: 0, boxShadow: '0 4px 12px rgba(205, 202, 202, 0.85)' }}>
          {TOOLTIPS[key]}
        </div>
      )}
    </div>
  )

  const ts = THEME_STYLE[theme]
  const suffix = TRAIT_SUFFIX[theme]
  const displayName = toName.trim() || 'OO'
  const filledTraits = traits.map((t, i) => t.trim() || `특징${i + 1}`)

  const previewScreens = [
    // 1. 첫 화면
    <div key="intro" style={{ width: '100%', height: '100%', paddingBottom: 40, background: ts.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, fontFamily: ts.font }}>
      <div style={{ fontSize: 12, color: ts.subText, letterSpacing: 3, marginBottom: 20 }}>WDYL</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: ts.text, textAlign: 'center', lineHeight: 1.5, marginBottom: 10 }}>
        <span style={{ color: ts.accent }}>{displayName}</span>님의 취향 분석
      </div>
      <div style={{ fontSize: 13, color: ts.subText, textAlign: 'center', lineHeight: 1.7, marginBottom: 28 }}>
        {theme === 'formal' && '간단한 선택으로\n취향을 알려주세요.'}
        {theme === 'friend' && '너의 소원을 말해봐🤝🏻'}
        {theme === 'sweet'  && '두근두근 취향 테스트 💕'}
      </div>
      <div style={{ background: ts.accent, color: theme === 'formal' ? '#000' : '#fff', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 700 }}>
        START
      </div>
    </div>,

    // 2. 설문 화면
    <div key="survey" style={{ width: '100%', height: '100%', paddingBottom: 40, background: ts.bg, display: 'flex', flexDirection: 'column', padding: 24, fontFamily: ts.font }}>
      <div style={{ fontSize: 11, color: ts.subText, marginBottom: 8 }}>1 / 3</div>
      <div style={{ width: '100%', height: 4, background: ts.cardBg, borderRadius: 2, marginBottom: 20 }}>
        <div style={{ width: '33%', height: '100%', background: ts.accent, borderRadius: 2 }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: ts.text, marginBottom: 16, lineHeight: 1.5 }}>
        요즘 가장 끌리는 선물은?
      </div>
      {['☕ 카페 기프티콘', '🍽️ 맛있는 음식', '📚 책이나 다이어리'].map((item, i) => (
        <div key={i} style={{ background: i === 0 ? ts.accent : ts.cardBg, borderRadius: 10, padding: '12px 16px', marginBottom: 8, fontSize: 13, fontWeight: 600, color: i === 0 ? (theme === 'formal' ? '#000' : '#fff') : ts.text }}>
          {item}
        </div>
      ))}
    </div>,
    // 3. 결과 화면
    <div key="result" style={{ width: '100%', height: '100%', paddingBottom: 40, background: ts.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: ts.font }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>
        {theme === 'formal' ? '🎩' : theme === 'friend' ? '🤝🏻' : '💕'}
      </div>
      <div style={{ background: ts.cardBg, borderRadius: 16, padding: '20px 16px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: ts.subText, lineHeight: 2.0 }}>
          당신은 <br />
          <span style={{ color: ts.accent, fontWeight: 700 }}>{filledTraits[0]}{suffix[0]}</span>,{' '}
          <span style={{ color: ts.accent, fontWeight: 700 }}>{filledTraits[1]}{suffix[1]}</span>,<br />
          <span style={{ color: ts.accent, fontWeight: 700 }}>{filledTraits[2]}{suffix[2]}</span> 사람에게<br />
          <span style={{ color: ts.text, fontWeight: 800, fontSize: 15 }}>센스있는 선물</span>을 하고 싶은<br />
          따뜻한 사람이군요!
        </div>
      </div>
    </div>,
  ]

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={tooltipRef}
        style={{ background: '#F4F1EB', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480, padding: '28px 22px 48px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ width: 40, height: 4, background: '#DDD8CF', borderRadius: 2, margin: '0 auto 24px' }} />
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1C1C1C', marginBottom: 32 }}>새 티켓 만들기</div>

        {/* TO */}
        <div style={{ marginBottom: 28 }}>
          {sectionLabel('TO')}
          <div style={{ background: '#fff', border: '1.5px solid #EDE9E1', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <input style={inputStyle} placeholder="이름 또는 닉네임" value={toName} onChange={e => setToName(e.target.value)} maxLength={24} />
            <span style={{ fontSize: 14, color: '#CCC', whiteSpace: 'nowrap' }}>에게</span>
          </div>
        </div>

        {/* ABOUT WHO */}
        <div style={{ marginBottom: 32 }}>
          {sectionLabel('ABOUT WHO')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {traits.map((trait, i) => (
              <div key={i} style={{ background: '#fff', border: '1.5px solid #EDE9E1', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#DDD8CF', width: 18, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <input
                  style={{ ...inputStyle, fontSize: 15, fontWeight: 400 }}
                  placeholder={['ex) 솔직하고', 'ex) 센스있고', 'ex) 집콕러'][i]}
                  value={trait}
                  onChange={e => setTrait(i, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#C0BAB0', marginTop: 10, lineHeight: 1.6 }}>
            ✦ 설문 결과 화면에 적용됩니다
          </div>
        </div>


        {/* CONCEPT */}
        <div style={{ marginBottom: 28 }}>
          {sectionLabel('CONCEPT')}
          <div style={{ display: 'flex', gap: 8 }}>
            {THEMES.map(t => (
              <button key={t.value} onClick={() => setTheme(t.value)} style={{ flex: 1, background: theme === t.value ? '#FEF8EC' : '#fff', border: `1.5px solid ${theme === t.value ? '#F9B233' : '#EDE9E1'}`, borderRadius: 12, padding: '14px 6px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{t.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme === t.value ? '#F9B233' : '#AAA' }}>{t.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 미리보기 영역 */}
        {showPreview && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#AAA', letterSpacing: '-0.4px', marginBottom: 10 }}>
              PREVIEW <span style={{ fontSize: 14, fontWeight: 700, color: '#1C1C1C', marginLeft: 2 }}>{['# START', '# SURVEY', '# FINAL'][previewPage]}</span>
            </div>
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 330, border: '1px solid #EDE9E1' }}>
              {previewScreens[previewPage]}
              {previewPage > 0 && (
                <button onClick={() => setPreviewPage(p => p - 1)} style={{ position: 'absolute', left: 10, top: '90%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
              )}
              {previewPage < 2 && (
                <button onClick={() => setPreviewPage(p => p + 1)} style={{ position: 'absolute', right: 10, top: '90%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={20} /></button>
              )}
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} onClick={() => setPreviewPage(i)} style={{ width: i === previewPage ? 16 : 6, height: 6, borderRadius: 3, background: i === previewPage ? ts.accent : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => { setShowPreview(true); setPreviewPage(0) }}
            style={{ width: '100%', background: '#0062CC', color: '#fff', border: 'none', borderRadius: 14, padding: '17px 0', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
          >
            티켓 미리보기
          </button>
          {showPreview && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', background: loading ? '#CCC' : '#F9B233', color: '#1C1C1C', border: 'none', borderRadius: 14, padding: '17px 0', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? '생성 중...' : '🎁 티켓 생성하기'}
            </button>
          )}
          <button onClick={onClose} style={{ width: '100%', background: '#fff', color: '#888', border: '1.5px solid #EDE9E1', borderRadius: 14, padding: '15px 0', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            취소하기
          </button>
        </div>

      </div>
    </div>
  )
}