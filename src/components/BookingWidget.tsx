"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Users, ChevronRight, ArrowLeft, Check, RefreshCw } from 'lucide-react';

const API_BASE = 'https://newsletter-api.eka-prasaja.workers.dev';

interface Schedule {
  id: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  location: string;
  quota: number;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  schedules?: Schedule[];
}

interface BookingWidgetProps {
  doctorId: string;
  onClose: () => void;
}

export default function BookingWidget({ doctorId, onClose }: BookingWidgetProps) {
  const [step, setStep] = useState<'schedules' | 'form' | 'success'>('schedules');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Form fields
  const [form, setForm] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    complaint: ''
  });

  // Fetch schedules for this doctor
  useEffect(() => {
    async function fetchDoctorSchedules() {
      try {
        const res = await fetch(`${API_BASE}/v1/medical/doctors`);
        if (!res.ok) throw new Error('Gagal mengambil data jadwal.');
        const data = await res.json();
        const found = (data.doctors || []).find((d: any) => d.id === doctorId);
        if (found) {
          setDoctor(found);
          setSchedules(found.schedules || []);
        } else {
          setError('Jadwal dokter belum diisi dari dashboard admin.');
        }
      } catch (e) {
        setError('Koneksi gagal. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }
    if (doctorId) fetchDoctorSchedules();
  }, [doctorId]);

  const handleSelectSchedule = (sch: Schedule) => {
    setSelectedSchedule(sch);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule || !doctor) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/v1/medical/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          scheduleId: selectedSchedule.id,
          patientName: form.patientName,
          patientPhone: form.patientPhone,
          patientEmail: form.patientEmail,
          complaint: form.complaint,
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookingResult(data.detail);
        setStep('success');
      } else {
        setError(data.error || 'Pendaftaran gagal, coba lagi.');
      }
    } catch (e) {
      setError('Kesalahan jaringan, coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-white/50">Memuat jadwal praktik...</p>
      </div>
    );
  }

  if (error && !bookingResult) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-6">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <span className="text-xl font-bold">!</span>
        </div>
        <p className="text-sm text-white/70">{error}</p>
        <button onClick={() => setError('')} className="text-xs text-primary hover:underline">Coba Lagi</button>
      </div>
    );
  }

  if (step === 'schedules') {
    return (
      <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto py-2 pr-1">
        <div className="text-left">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Pilih Jadwal Kunjungan</p>
          <h2 className="text-xl font-black text-white leading-tight">{doctor?.name?.split(' (')[0]}</h2>
          <p className="text-xs text-white/40 font-semibold mt-1">{doctor?.specialty}</p>
        </div>

        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 bg-white/5 border border-dashed border-white/10 rounded-3xl text-center">
            <Calendar className="w-8 h-8 text-white/20" />
            <p className="text-sm font-bold text-white/40">Belum ada jadwal praktik tersedia.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-white/40">Pilih salah satu lokasi dan jadwal praktik di bawah ini:</p>
            {schedules.map((sch) => (
              <motion.button
                key={sch.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectSchedule(sch)}
                className="w-full text-left p-5 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/40 rounded-2xl transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="text-primary w-4 h-4" />
                      <span className="text-sm font-black text-white group-hover:text-primary transition-colors">{sch.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 pl-6">
                      <span className="text-xs text-white/50 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {sch.day}
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {sch.timeStart} – {sch.timeEnd} WIB
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        Kuota: {sch.quota}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-white/20 group-hover:text-primary transition-colors mt-1 w-5 h-5" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto py-2 pr-1">
        <button
          onClick={() => { setStep('schedules'); setSelectedSchedule(null); setError(''); }}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Ganti Jadwal
        </button>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Jadwal Dipilih</p>
          <p className="text-sm font-bold text-white">{selectedSchedule?.location}</p>
          <p className="text-xs text-white/50 mt-1">{selectedSchedule?.day} · {selectedSchedule?.timeStart}–{selectedSchedule?.timeEnd} WIB</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Nama Lengkap Pasien *</label>
            <input
              required
              type="text"
              placeholder="Sesuai KTP"
              value={form.patientName}
              onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">No. WhatsApp *</label>
              <input
                required
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={form.patientPhone}
                onChange={e => setForm(f => ({ ...f, patientPhone: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Email *</label>
              <input
                required
                type="email"
                placeholder="email@anda.com"
                value={form.patientEmail}
                onChange={e => setForm(f => ({ ...f, patientEmail: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Keluhan Utama *</label>
            <textarea
              required
              rows={3}
              placeholder="Deskripsikan singkat keluhan Anda..."
              value={form.complaint}
              onChange={e => setForm(f => ({ ...f, complaint: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all text-xs uppercase tracking-widest"
          >
            {submitting ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Mendaftarkan...</>
            ) : (
              <><Check className="w-4 h-4" /> Konfirmasi Pendaftaran</>
            )}
          </button>
        </form>
      </div>
    );
  }

  if (step === 'success' && bookingResult) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8 text-center h-full max-h-[75vh] overflow-y-auto pr-1">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400"
        >
          <Check className="w-10 h-10" />
        </motion.div>

        <div>
          <h3 className="text-2xl font-black text-white mb-2">Pendaftaran Berhasil!</h3>
          <p className="text-xs text-white/40">Konfirmasi dikirim ke email & WhatsApp Anda.</p>
        </div>

        <div className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-left space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-xs text-white/40 font-semibold">Nomor Antrean</span>
            <span className="text-3xl font-black text-primary">#{bookingResult.queueNumber}</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/40">Dokter</span>
              <span className="text-white font-bold text-right max-w-[60%]">{bookingResult.doctor?.name?.split(' (')[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Lokasi</span>
              <span className="text-white font-bold text-right max-w-[60%]">{bookingResult.schedule?.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Hari & Jam</span>
              <span className="text-white font-bold">{bookingResult.schedule?.day} · {bookingResult.schedule?.timeStart}–{bookingResult.schedule?.timeEnd}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Nama Pasien</span>
              <span className="text-white font-bold">{bookingResult.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">ID Booking</span>
              <span className="text-white/60 font-mono text-[10px]">{bookingResult.bookingId}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-white/30 max-w-xs">Harap tiba 15 menit sebelum jadwal dimulai. Tunjukkan nomor antrean ini kepada petugas.</p>

        <button
          onClick={onClose}
          className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-widest"
        >
          Tutup
        </button>
      </div>
    );
  }

  return null;
}
