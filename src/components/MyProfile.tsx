'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogOut, Wallet } from 'lucide-react'

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

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  init:      { label: '전송 대기', color: '#64748b', bg: '#f1f5f9' },
  progress:  { label: '진행중',   color: '#F9B233', bg: '#fff7ed' },
  complete:  { label: '완료',     color: '#0062CC', bg: '#eff6ff' },
  cancelled: { label: '취소됨',   color: '#ef4444', bg: '#fef2f2' },
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
      fontFamily: "'Pretendard', sans-serif",
      maxWidth: 480,
      margin: '0 auto',
      padding: '0 20px 40px',
      backgroundColor: '#FAFAFA',
      color: '#1A1A1A'
    }}>

      {/* 상단 네비게이션 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0',
      }}>
        <Image src="/wdyl_logo.png" alt="WDYL" width={80} height={38} style={{ objectFit: 'contain' }} />
        <button style={{
          fontSize: 12,
          color: '#94a3b8',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontWeight: 500
        }} onClick={handleLogout}>
          <LogOut size={14} />
          <span>로그아웃</span>
        </button>
      </div>

      {/* 프로필 섹션: 화이트 & 미니멀 */}
      <div style={{
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 28, 
          overflow: 'hidden',
          backgroundColor: '#fff',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
          marginBottom: 16,
          border: '1px solid #f1f5f9'
        }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, backgroundColor: '#f8fafc' }}>
              🙂
            </div>
          )}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>{nickname}</h2>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>{email}</p>
      </div>

      {/* 보유 크레딧 카드: Deep Blue 포인트 */}
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '24px',
        color: '#0062CC',
        boxShadow: '0 8px 5px -1px rgba(166, 192, 220, 0.8)',
        marginBottom: 0,
        border: '1px solid #0062CC',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.8, fontSize: 13, marginBottom: 8 }}>
            <Wallet size={14} />
            <span>내 지갑</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>
            {credits.toLocaleString()}
            <span style={{ fontSize: 18, fontWeight: 400, marginLeft: 4, opacity: 0.9 }}>크레딧</span>
          </div>
          <button style={{
            width: '100%',
            background: '#0062CC',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: '12px 0',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(75, 88, 103, 0.56)'
          }}>
            크레딧 충전하기
          </button>
        </div>
      </div>
    </div>
  )
}