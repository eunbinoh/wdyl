'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Plus } from 'lucide-react'
import CreateTicketModal from './ModalCreateTicket'

type Ticket = {
  id: string
  status: 'init' | 'progress' | 'complete' | 'cancelled'
  to_name: string
  theme: string
  created_at: string
}

type Props = {
  credits: number
  tickets: Ticket[]
  userId: string
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  init:      { label: '전송 대기', color: '#64748b', bg: '#f1f5f9' },
  progress:  { label: '진행중',   color: '#F9B233', bg: '#fff7ed' },
  complete:  { label: '완료',     color: '#0062CC', bg: '#eff6ff' },
  cancelled: { label: '취소됨',   color: '#ef4444', bg: '#fef2f2' },
}

const THEME_EMOJI: Record<string, string> = {
  formal: '🎩',
  friend: '🎉',
  sweet:  '🍬',
}

export default function MyTickets({ userId, credits, tickets }: Props) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  return (
    <div style={{
      fontFamily: "'Pretendard', sans-serif",
      maxWidth: 480,
      margin: '0 auto',
      padding: '0 20px 40px',
      minHeight: '100vh',
      backgroundColor: '#FAFAFA',
      color: '#1A1A1A'
    }}>
      <button style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto 20px',
        backgroundColor: '#FAFAFA',
        color: '#F9B233',
        border: '1px solid #F9B233',
        borderRadius: 16,
        padding: '14px 20px',
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px -1px rgba(249, 176, 51, 0.59)'
        }}
        onClick={() => setShowModal(true)}
      >
        NEW 티켓 만들기
      </button>
      <div style={{
        fontFamily: "'Pretendard', sans-serif",
        maxWidth: 480,
        margin: '0 auto',
        padding: '0 20px 40px',
        backgroundColor: '#FAFAFA',
        color: '#1A1A1A'
      }}>
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#334155' }}>최근 티켓</span>
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              전체보기 <ChevronRight size={14} />
            </span>
          </div>

          {tickets.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 0',
              background: '#fff',
              borderRadius: 24,
              border: '1px dashed #e2e8f0',
              color: '#94a3b8',
              fontSize: 14,
            }}>
              아직 생성된 티켓이 없습니다.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tickets.map((ticket) => {
                const status = STATUS_LABEL[ticket.status]
                return (
                  <div key={ticket.id} style={{
                    background: '#fff',
                    borderRadius: 20,
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    border: '1px solid #f1f5f9',
                    transition: 'transform 0.2s',
                  }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24
                    }}>
                      {THEME_EMOJI[ticket.theme] ?? '🎁'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 2 }}>
                        {ticket.to_name}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        {new Date(ticket.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: status.color,
                      background: status.bg,
                      padding: '6px 12px',
                      borderRadius: 10,
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
      {/* 모달 */}
      {showModal && (
        <CreateTicketModal
          userId={userId}
          credits={credits}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}