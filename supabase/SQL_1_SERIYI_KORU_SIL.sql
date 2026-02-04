-- ============================================
-- GUNLUK GOREVLERDEN "SERIYI KORU" GOREVINI KALDIR
-- ============================================
-- Bu SQL'i once calistir

DELETE FROM daily_tasks
WHERE task_type = 'maintain_streak'
   OR title ILIKE '%seri%koru%'
   OR title ILIKE '%streak%';

-- Ilerleme kayitlari KORUNUYOR - silinmiyor!
