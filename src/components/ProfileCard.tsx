'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogOut } from 'lucide-react'

type Ticket = {
  id: string
  status: 'init' | 'progress' | 'complete' | 'cancelled'
  to_name: string
  theme: string
  created_at: string
}

type Props = {
  nickname: string
  email: string
  avatarUrl?: string
  credits: number
  tickets: Ticket[]
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  init:      { label: '전송 대기', color: '#A0A0A0' },
  progress:  { label: '진행중',   color: '#F5A623' },
  complete:  { label: '완료',     color: '#4CAF82' },
  cancelled: { label: '취소됨',   color: '#E05A5A' },
}

const THEME_EMOJI: Record<string, string> = {
  formal: '🎩',
  friend: '🎉',
  sweet:  '🍬',
}

export default function ProfileCard({ nickname, email, avatarUrl, credits, tickets }: Props) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase?.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      maxWidth: 480,
      margin: '0 auto',
      padding: '24px 20px',
      minHeight: '100vh',
    }}>

      {/* 헤더 로고 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
        marginLeft: -10
      }}>
        <Image src="/wdyl_logo.png" alt="WDYL" width={100} height={48} />
        <button   style={{
          fontSize: 13,
          color: '#999',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
        }} onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: 4 }} />
          <span style={{ fontWeight: 600, marginTop: '2px' }}>LOGOUT</span>
        </button>
      </div>

      {/* 프로필 카드 */}
      <div style={{
        background: '#FEE500',
        borderRadius: 20,
        padding: '16px 12px',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#F0D800',
            flexShrink: 0,
            border: '2px solid rgba(0,0,0,0.08)',
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                🙂
              </div>
            )}
          </div>

          {/* 유저 정보 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>
              {nickname}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
              {email}
            </div>
          </div>
        </div>

        {/* 크레딧 */}
        <div style={{
          marginTop: 20,
          background: 'rgba(252, 200, 98, 0.06)',
          borderRadius: 12,
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 2 }}>보유 크레딧</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-1px' }}>
              {credits}
              <span style={{ fontSize: 14, fontWeight: 500, marginLeft: 2 }}>크레딧</span>
            </div>
          </div>
          <button style={{
            background: '#F9B233',
            color: '#FEE500',
            border: 'none',
            borderRadius: 10,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}>
            충전하기
          </button>
        </div>
      </div>

      {/* 티켓 만들기 버튼 */}
      <button style={{
        width: '100%',
        background: '#0062CC',
        color: '#fff',
        border: 'none',
        borderRadius: 16,
        padding: '18px 0',
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        marginBottom: 24,
        letterSpacing: '-0.3px',
      }}>
        티켓 만들기
      </button>

      {/* 최근 티켓 목록 */}
      <div>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#999',
          marginBottom: 12,
          letterSpacing: '0.5px',
        }}>
          최근 티켓
        </div>

        {tickets.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#CCC',
            fontSize: 14,
          }}>
            아직 만든 티켓이 없어요
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tickets.map((ticket) => {
              const status = STATUS_LABEL[ticket.status]
              return (
                <div key={ticket.id} style={{
                  background: '#fff',
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: '1px solid #F0F0F0',
                }}>
                  <div style={{ fontSize: 24 }}>
                    {THEME_EMOJI[ticket.theme] ?? '🎁'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>
                      {ticket.to_name}에게
                    </div>
                    <div style={{ fontSize: 11, color: '#CCC' }}>
                      {new Date(ticket.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: status.color,
                    background: `${status.color}18`,
                    padding: '4px 10px',
                    borderRadius: 20,
                  }}>
                    {status.label}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}